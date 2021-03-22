type Demo = {
  name: string;
  path: string;
  code?: string;
};

type DemoResp = {
  rootPath: string;
  demos: Demo[];
};

export async function getJson<T = unknown>(path: string) {
  const resp = await fetch(path);
  return resp.json() as Promise<T>;
}

export function getDemos() {
  return getJson<DemoResp>("/api/ui/demos");
}

export function getCode(demo: string) {
  return fetch(`/demos/${demo}/main.cpp`).then((r) => r.text());
}

export async function saveCode(demo: string, code: string): Promise<void> {
  const resp = await fetch(`/api/ui/demos/${demo}`, {
    method: "PATCH",
    body: JSON.stringify({ code }),
    headers: {
      "content-type": "application/json",
    },
  });

  await resp.json();
}

export async function compileCode(demo: string) {
  const resp = await fetch(`/api/ui/demos/${demo}/compile`, {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
      "content-type": "application/json",
    },
  });

  const json = await resp.json();

  if (resp.status >= 300) {
    throw new Error(json.err || json.msg || json.message);
  }

  return json;
}
