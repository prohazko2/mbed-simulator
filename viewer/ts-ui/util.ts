export function delay(ms = 10) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function exportDebug<T = unknown>(name: string, v: T) {
  globalThis[name] = v;
}
