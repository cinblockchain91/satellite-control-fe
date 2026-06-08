import reactConfig from "@satellite-control/vitest-config/react";
import { defineConfig, mergeConfig } from "vitest/config";
import path from "path";

export default mergeConfig(
  reactConfig,
  defineConfig({
    test: {
      include: ["**/*.test.tsx", "**/*.test.ts"],
      setupFiles: ["./vitest.setup.ts"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }),
);
