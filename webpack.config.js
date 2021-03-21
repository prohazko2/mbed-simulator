try {
  require("dotenv").config();
} catch (err) {
  console.log(`${err.message}`);
  console.log("continue");
}

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const path = require("path");

const webpack = require("webpack");

const DEBUG = process.env["NODE_ENV"] === "development";

module.exports = {
  watch: DEBUG,
  mode: DEBUG ? "development" : "produection",

  entry: "./viewer/ts-ui/index.ts",

  experiments: {
    topLevelAwait: true,
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "viewer/js-ui/v2"),
    filename: "app.js",
  },
  node: {
    global: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      vscode: require.resolve("monaco-languageclient/lib/vscode-compatibility"),

      buffer: require.resolve("buffer/"),
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      fs: false,
      child_process: false,
      net: false,
      crypto: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.pid": JSON.stringify(1),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.ContextReplacementPlugin(/vscode*/, path.join(__dirname, "./")),
    new MonacoWebpackPlugin({
      languages: ["json", "cpp"],
      features: ["!referenceSearch"],
    }),
  ],
};
