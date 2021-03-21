type Demo = {
  name: string;
  code?: string;
};

export async function getJson<T = unknown>(path: string) {
  const resp = await fetch(path);
  return resp.json() as Promise<T>;
}

export function getDemos() {
  return getJson<Demo[]>("/api/ui/demos");
}

export function getCode(demo: string) {
  return fetch(`/demos/${demo}/main.cpp`).then((r) => r.text());
}
