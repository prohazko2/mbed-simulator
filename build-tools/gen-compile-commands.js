const dir = require("path").resolve(__dirname, "..");


const lines = require("fs")
  .readFileSync(`${__dirname}/include-dirs.txt`)
  .toString()
  .split("\n")
  .map((x) => x.trim())
  .filter((x) => !!x)
  .map((x) => x.replace("/app/", `-I${dir}/`));

const file = `${dir}/demos/blinky/main.cpp`;

const cmd = {
  command: `/usr/bin/clang++ -DLSP_INDEX_ONLY -DTARGET_SIMULATOR ${lines.join(
    " "
  )} -c ${file}`,
  directory: dir,
  file,
};

console.log(JSON.stringify([cmd], null, 2));
