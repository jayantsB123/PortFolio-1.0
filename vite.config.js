import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { portfolioMetadata, resolveDeploymentSiteUrl, siteIndexFiles } from "./src/v2/siteMetadata.js";

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const siteUrl = resolveDeploymentSiteUrl(env, process.env);
  return {
    plugins: [
      react(),
      {
        name: "portfolio-metadata",
        transformIndexHtml(html) {
          return portfolioMetadata(html, { ...env, VITE_PORTFOLIO_SITE_URL: siteUrl });
        },
        generateBundle() {
          if (command !== "build") return;
          for (const file of siteIndexFiles(siteUrl)) {
            this.emitFile({ type: "asset", ...file });
          }
        },
      },
    ],
  };
});
