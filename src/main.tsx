import React from "react";
import ReactDOM from "react-dom/client";
import { Web3AuthProvider } from "@web3auth/modal-react-hooks";
import web3AuthContextConfig from "./web3authContext";
import "./index.css";

// Polyfills for browser compatibility
import { Buffer } from "buffer";
// Import process directly
import * as process from "process";

// Make Buffer and process available globally
window.Buffer = Buffer;
window.process = process as any;

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Web3AuthProvider config={web3AuthContextConfig}>
      <App />
    </Web3AuthProvider>
  </React.StrictMode>
);