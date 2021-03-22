import { listen, MessageConnection } from "vscode-ws-jsonrpc";
import * as monaco from "monaco-editor";

import {
  MonacoLanguageClient,
  //MessageConnection,
  CloseAction,
  ErrorAction,
  MonacoServices,
  createConnection,
} from "monaco-languageclient";

import normalizeUrl from "normalize-url";

import ReconnectingWebSocket from "reconnecting-websocket";

monaco.languages.register({
  id: "cpp",
  extensions: [".cpp"],
  aliases: ["cpp", "c++", "cc", "c", "ino"],
});

export type LspOptions = {
  rootPath: string;
}

export function registerCpp(
  editor: monaco.editor.IStandaloneCodeEditor,
  opts: LspOptions
) {

  MonacoServices.install(editor, {
    rootUri: `file://${opts.rootPath}`,
  });

  const url = createUrl(`ws://${location.host}/lsp/cpp`);
  const webSocket = createWebSocket(url);

  listen({
    webSocket: webSocket as any,
    onConnection: (connection) => {
      const languageClient = createLanguageClient(connection);
      const disposable = languageClient.start();
      connection.onClose(() => disposable.dispose());
    },
  });

  function createLanguageClient(
    connection: MessageConnection
  ): MonacoLanguageClient {
    return new MonacoLanguageClient({
      name: "Sample Language Client",
      clientOptions: {
        documentSelector: ["cpp"],
        errorHandler: {
          error: () => ErrorAction.Continue,
          closed: () => CloseAction.DoNotRestart,
        },
      },
      connectionProvider: {
        get: (errorHandler, closeHandler) => {
          return Promise.resolve(
            createConnection(connection, errorHandler, closeHandler)
          );
        },
      },
    });
  }

  function createUrl(path: string): string {
    return normalizeUrl(path);
  }

  function createWebSocket(url: string): ReconnectingWebSocket {
    const socketOptions = {
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1.3,
      connectionTimeout: 10000,
      maxRetries: Infinity,
      debug: false,
    };
    return new ReconnectingWebSocket(url, [], socketOptions);
  }
}

//export { MonacoServices };
