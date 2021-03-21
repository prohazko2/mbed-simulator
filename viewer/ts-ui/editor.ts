import * as monaco from "monaco-editor";

import { exportDebug } from "./util";

import { listen } from "@codingame/monaco-jsonrpc";
import {
  MonacoLanguageClient,
  //MessageConnection,
  CloseAction,
  ErrorAction,
  MonacoServices,
  createConnection,
} from "monaco-languageclient";

console.log({
  listen,
  MonacoLanguageClient,
  createConnection,
  MonacoServices,
});

import { restored, beforeUnload } from "./store";

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

exportDebug("_monaco", monaco);
exportDebug("_editor", () => lastEditor);
