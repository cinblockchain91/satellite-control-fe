import baseConfig from "@satellite-control/vitest-config/base";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ["**/*.test.ts"],
    },
  }),
);
