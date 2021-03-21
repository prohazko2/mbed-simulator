import typescript from "@rollup/plugin-typescript";

export default {
  input: "viewer/ts-ui/index.ts",
  output: {
    file: "viewer/js-ui/ts-ui.js",
    format: "es",
  },
  plugins: [typescript()],
};
