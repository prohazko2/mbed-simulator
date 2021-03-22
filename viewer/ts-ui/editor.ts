import * as monaco from "monaco-editor";

import { exportDebug } from "./util";
import { restored, beforeUnload } from "./store";

import { registerCpp } from "./lsp";

function getEditorOptions() {
  return {
    fontSize: restored.editorFontSize || 12.6,

    model: monaco.editor.createModel(
      "",
      "cpp",
      monaco.Uri.parse(
        "file:///app/demos/blinky/main.cpp"
      )
    ),

    automaticLayout: true,
    glyphMargin: true,

    language: "cpp",
    theme: "vs-dark",

    minimap: {
      enabled: false,
    },

    lightbulb: {
      enabled: true,
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

  let e: any = lastEditor;

  if (!e._commandService.addCommand) {
    e._commandService.addCommand = (...args) => {
      console.log("e._commandService.addCommand", args);
    };
  }

  console.log({
    s1: e._commandService,
    s2: e._commandService.addCommand,
  });

  registerCpp(lastEditor);

  return lastEditor;
}

beforeUnload(() => {
  return {
    editorFontSize: lastEditor?.getOption(monaco.editor.EditorOption.fontSize),
  };
});

exportDebug("monaco", monaco);
exportDebug("_monaco", monaco);
exportDebug("_editor", () => lastEditor);
