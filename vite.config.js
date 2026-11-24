import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { portfolioMetadata } from "./src/v2/siteMetadata.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [
      react(),
      {
        name: "portfolio-metadata",
        transformIndexHtml(html) {
          return portfolioMetadata(html, env);
        },
      },
    ],
  };
});
