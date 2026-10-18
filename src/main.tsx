import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "@fontsource-variable/hanken-grotesk/wght.css";
import "@fontsource-variable/source-serif-4/wght.css";
import "./styles.css";
import { App } from "./App";
import { DemoProvider } from "./state/DemoContext";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <DemoProvider>
        <App />
      </DemoProvider>
    </HashRouter>
  </React.StrictMode>,
);
