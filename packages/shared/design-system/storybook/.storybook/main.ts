import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";
import type { StorybookConfig } from "@storybook/react-vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// __dirname = .storybook/  →  ../../ = packages/shared/design-system/
const DS_ROOT = resolve(__dirname, "../../");

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.stories.@(ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(cfg) {
    return mergeConfig(cfg, {
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          "@satellite-control/ds-tokens/css": resolve(
            DS_ROOT,
            "tokens/build/css/tokens.css",
          ),
          "@satellite-control/ds-ui-web/css": resolve(
            DS_ROOT,
            "ui-web/index.css",
          ),
          "@satellite-control/ds-ui-web": resolve(
            DS_ROOT,
            "ui-web/src/index.ts",
          ),
          "@satellite-control/ds-icons/react": resolve(
            DS_ROOT,
            "icons/dist/react/index.ts",
          ),
        },
      },
    });
  },
};

export default config;
