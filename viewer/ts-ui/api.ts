type Demo = {
  name: string;
  code?: string;
};

async function getJson<T = unknown>(path: string) {
  const resp = await fetch(path, {});
  return resp.json() as Promise<T>;
}

export function getDemos() {
  return getJson<Demo[]>("/api/ui/demos");
}
