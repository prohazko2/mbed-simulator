const ws = require("ws");

const rpcServer = require("vscode-ws-jsonrpc/lib/server");

let clangdBin = process.env["CLANGD_BIN"];

if (!clangdBin) {
  const maybeLocal = require("path").resolve(
    __dirname,
    "..",
    "clangd/bin/clangd"
  );
  if (require("fs").existsSync(maybeLocal)) {
    clangdBin = maybeLocal;
  }
}
if (!clangdBin) {
  clangdBin = "clangd";
}

let languageServers = {
  //"lsp/cpp": ["ccls", `--init=${JSON.stringify(initOpts)}`],
  "lsp/cpp": [clangdBin],
};

const ccls = languageServers["lsp/cpp"];
console.log(`lsp: ${ccls[0]} ${ccls[1]}`);

function attach(server) {
  const wss = new ws.Server(
    {
      server,
    },
    () => {
      console.log(`lsp: Listening to http and ws`);
    }
  );
  function toSocket(webSocket) {
    return {
      send: (content) => webSocket.send(content),
      onMessage: (cb) => (webSocket.onmessage = (event) => cb(event.data)),
      onError: (cb) =>
        (webSocket.onerror = (event) => {
          if ("message" in event) {
            cb(event.message);
          }
        }),
      onClose: (cb) =>
        (webSocket.onclose = (event) => cb(event.code, event.reason)),
      dispose: () => webSocket.close(),
    };
  }

  wss.on("connection", (client, request) => {
    let langServer;

    console.log(`try lsp onnect: ${request.url}`);
    if (!request.url.includes("lsp/cpp")) {
      return;
    }

    Object.keys(languageServers).forEach((key) => {
      if (request.url === "/" + key) {
        langServer = languageServers[key];
      }
    });
    if (!langServer || !langServer.length) {
      console.error("Invalid language server", request.url);
      client.close();
      return;
    }
    let localConnection = rpcServer.createServerProcess(
      "Example",
      langServer[0],
      langServer.slice(1)
    );
    let socket = toSocket(client);
    let connection = rpcServer.createWebSocketConnection(socket);
    rpcServer.forward(connection, localConnection);
    console.log(`Forwarding new client`);
    socket.onClose((code, reason) => {
      console.log("Client closed", reason);
      localConnection.dispose();
    });
  });

  return wss;
}

module.exports = { attach };
