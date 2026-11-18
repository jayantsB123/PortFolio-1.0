import React from "react";
import ReactDOM from "react-dom/client";
import PortfolioApp from "./v2/PortfolioApp.jsx";

// Preserve the original App.jsx and its components for reference and migration.
// Only the entry point changes on the feature branch.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PortfolioApp />
  </React.StrictMode>
);
