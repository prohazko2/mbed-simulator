import { listen } from "@codingame/monaco-jsonrpc";
import * as monaco from "monaco-editor";

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

export { MonacoServices };
