import * as monaco from "monaco-editor";

import { exportDebug } from "./util";
import { restored, beforeUnload } from "./store";

import { LspOptions, registerCpp } from "./lsp";

function getEditorOptions() {
  return {
    fontSize: restored.editorFontSize || 12.6,

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

type Changes = {
  init: string;
  text: string;
  hasChanges: boolean;
};

let editor: monaco.editor.IStandaloneCodeEditor;
let model: monaco.editor.ITextModel;
let text: string;

export function initModel(path: string, value: string) {
  const uri = monaco.Uri.parse(`file://${path}`);
  if (model) {
    model.dispose();
  }
  text = value;
  model = monaco.editor.createModel(value, "cpp", uri);

  model.onDidChangeContent(() => {
    const current = editor.getValue();
    for (const handler of changeHandlers) {
      handler({ init: text, text: current, hasChanges: text != current });
    }
  });
  return model;
}

export function commitModel() {
  text = editor.getValue();
  for (const handler of changeHandlers) {
    handler({ init: text, text: text, hasChanges: text != text });
  }
}

export function initEditor(element: HTMLElement, opts: LspOptions) {
  editor = monaco.editor.create(element, getEditorOptions());

  let e: any = editor;

  // TODO: monaco-languageclient fails here, investigate
  if (!e._commandService.addCommand) {
    e._commandService.addCommand = (args: any) => {
      console.log("e._commandService.addCommand", args);
    };
  }

  registerCpp(editor, opts);

  return editor;
}

export function addCommand(shorthand: string, title: string, action: Function) {
  /* For simplicity assume that cmd is always Ctrl */
  const [, key] = shorthand.split("+");

  editor.addAction({
    id: `_${title}`,
    label: title,
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode[`KEY_${key}`]],
    run: () => {
      action();
      return null;
    },
  });
}

beforeUnload(() => {
  return {
    editorFontSize: editor?.getOption(monaco.editor.EditorOption.fontSize),
  };
});

exportDebug("monaco", monaco);
exportDebug("_monaco", monaco);
exportDebug("_editor", () => editor);

type ChangeHandler = (changes: Changes) => void;
const changeHandlers: ChangeHandler[] = [];
export function onChange(handler: ChangeHandler) {
  changeHandlers.push(handler);
}
