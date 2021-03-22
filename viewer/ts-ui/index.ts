import { getDemos, getCode, saveCode as saveCodeApi, compileCode } from "./api";
import { restored, commit as commitStore } from "./store";

import {
  initEditor,
  initModel,
  commitModel,
  onChange as onCodeChange,
  addCommand as addEditorCommand,
} from "./editor";

import { exportDebug } from "./util";

exportDebug("setImmediate", (fn) => setTimeout(fn, 0));

const { rootPath, demos } = await getDemos();
let selectedDemo: string;

const select = document.getElementById("select-project") as HTMLSelectElement;
const sim = document.querySelector("#viewer iframe") as HTMLIFrameElement;

const saveButton = document.getElementById("save-demo") as HTMLButtonElement;
const runButton = document.getElementById("run") as HTMLButtonElement;
const runStatus = document.getElementById("run-status") as HTMLElement;
const compileFailed = document.querySelector(
  "#compilation-failed"
) as HTMLElement;

const editor = initEditor(document.getElementById("editor"), { rootPath });

onCodeChange(({ hasChanges }) => {
  saveButton.disabled = !hasChanges;
});

async function loadCode(demoName: string) {
  selectedDemo = demoName;

  const demo = demos.find(({ name }) => name === demoName);
  const code = await getCode(demoName);
  editor.setModel(initModel(demo.path, code));
  commitStore({ demo: demoName });

  if (sim) {
    sim.src = `/view/${demoName}`;
    sim.style.display = "block";
  }
}

async function saveCode() {
  await saveCodeApi(selectedDemo, editor.getValue());
  commitModel();
}

addEditorCommand("Ctrl+S", "Save Demo", saveCode);
saveButton.addEventListener("click", saveCode);

runButton.addEventListener("click", async () => {
  runButton.disabled = true;
  runStatus.textContent = "saving ...";

  await saveCode();

  runStatus.textContent = "compiling ...";
  try {
    await compileCode(selectedDemo);

    if (sim) {
      sim.src = `/view/${selectedDemo}`;
      sim.style.display = "block";
    }
    compileFailed.style.display = "none";
    runStatus.title = "";
    runStatus.textContent = "";
  } catch (err) {
    console.error(`compile code`);
    console.error(err);

    let text = err.toString() as string;
    if (text.length > 20) {
      text = `${text.slice(0, 20)} ...`;
    }
    runStatus.title = err.toString();
    runStatus.textContent = `Error: ${text}`;

    compileFailed.querySelector("pre").textContent = err.toString();
    compileFailed.style.display = "block";
    if (sim) {
      sim.style.display = "none";
    }
  }
  runButton.disabled = false;
});

select.addEventListener("change", () => loadCode(select.value));

for (const { name } of demos) {
  const selected = name === restored.demo;
  select.appendChild(new Option(name, name, selected, selected));
}
loadCode(select.value);
