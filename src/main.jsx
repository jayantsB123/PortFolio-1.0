import React from "react";
import ReactDOM from "react-dom/client";
import PortfolioApp from "./v2/PortfolioApp.jsx";
import { applyBrowserTab } from "./v2/browserTab.js";

// Preserve the original App.jsx and its components for reference and migration.
// Only the entry point changes on the feature branch.
applyBrowserTab();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PortfolioApp />
  </React.StrictMode>
);
