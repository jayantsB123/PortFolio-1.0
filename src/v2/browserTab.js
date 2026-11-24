import { browserTabConfig } from "./config/setenv";

export function applyBrowserTab(config = browserTabConfig, doc = document) {
  doc.title = config.title;

  let icon = doc.querySelector('link[rel="icon"]');
  if (!icon) {
    icon = doc.createElement("link");
    icon.setAttribute("rel", "icon");
    doc.head.append(icon);
  }

  const base = import.meta.env?.BASE_URL ?? "/";
  icon.setAttribute("type", "image/svg+xml");
  icon.setAttribute("href", base + "favicons/" + config.style + ".svg");
}
