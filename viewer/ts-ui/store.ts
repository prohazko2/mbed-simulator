const STORE_KEY = "_ui-state";

type UnloadHandler = () => Partial<UiStore>;
const unloadHandlers: UnloadHandler[] = [];

export interface UiStore {
  editorFontSize: number;
  demo: string;
}

export let restored = JSON.parse(
  localStorage.getItem(STORE_KEY) || "{}"
) as UiStore;

console.info("ui-store restored:", restored);

export function commit(state: Partial<UiStore>) {
  const filtered = Object.keys(state || {}).reduce((acc, key) => {
    if (state[key] !== undefined && state[key] !== null) {
      acc[key] = state[key];
    }
    return acc;
  }, {});
  restored = Object.assign(restored, filtered);
  localStorage.setItem(STORE_KEY, JSON.stringify(restored));
}

export function beforeUnload(handler: UnloadHandler) {
  unloadHandlers.push(handler);
}

window.addEventListener("beforeunload", () => {
  for (const handler of unloadHandlers) {
    commit(handler());
  }
});
