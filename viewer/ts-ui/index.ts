import { getDemos, getCode } from "./api";

const demos = await getDemos();

const select = document.getElementById("select-project") as HTMLSelectElement;
const editor = document.getElementById("editor");

async function loadCode(demo: string) {
  const code = await getCode(demo);
  editor.textContent = code;
}

select.addEventListener("change", () => loadCode(select.value));

for (const { name } of demos) {
  select.appendChild(new Option(name, name));
}
loadCode(select.value);
