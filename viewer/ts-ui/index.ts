import { getDemos, getCode } from "./api";
import { restored, commit } from "./store";

import { initEditor } from "./editor";

const demos = await getDemos();

const select = document.getElementById("select-project") as HTMLSelectElement;
const editor = initEditor(document.getElementById("editor"));

async function loadCode(demo: string) {
  const code = await getCode(demo);
  editor.setValue(code);
  commit({ demo });
}

select.addEventListener("change", () => loadCode(select.value));

for (const { name } of demos) {
  const selected = name === restored.demo;
  select.appendChild(new Option(name, name, selected, selected));
}
loadCode(select.value);

globalThis["_editor"] = editor;
