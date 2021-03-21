import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { restored, beforeUnload } from "./store";

console.log(restored);

function getEditorOptions() {
  return {
    fontSize: restored.editorFontSize || 12.6,

    automaticLayout: true,
    language: "cpp",
    theme: "vs-dark",

    minimap: {
      enabled: false,
    },

    suggest: {
      showKeywords: false,
    },
    scrollbar: {
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
  };
}

let lastEditor: monaco.editor.IStandaloneCodeEditor;

export function initEditor(element: HTMLElement) {
  lastEditor = monaco.editor.create(element, getEditorOptions());
  return lastEditor;
}

beforeUnload(() => {
  return {
    editorFontSize: lastEditor?.getOption(monaco.editor.EditorOption.fontSize),
  };
});

globalThis["_monaco"] = monaco;
