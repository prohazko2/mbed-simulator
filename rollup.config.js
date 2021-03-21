import typescript from "@rollup/plugin-typescript";

import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import commonjs from "@rollup/plugin-commonjs";
import monaco from "rollup-plugin-monaco-editor";

export default {
  input: "viewer/ts-ui/index.ts",
  output: {
    dir: "viewer/js-ui/v2",
    format: "es",
  },
  plugins: [
    postcss(),
    monaco({
      languages: ["json", "cpp"],
    }),
    resolve(),
    commonjs(),
    typescript(),
  ],
};
