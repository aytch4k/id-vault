// Polyfills for browser compatibility - must be first
import { Buffer } from "buffer";
import * as process from "process";

// Make Buffer and process available globally
window.Buffer = Buffer;
window.process = process as any;
window.global = window;

import React from "react";
import ReactDOM from "react-dom/client";
import { Web3AuthProvider } from "@web3auth/modal-react-hooks";
import web3AuthContextConfig from "./web3authContext";
import "./index.css";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Web3AuthProvider config={web3AuthContextConfig}>
      <App />
    </Web3AuthProvider>
  </React.StrictMode>
);