import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "packages/entities/*/vitest.config.ts",
  "packages/features/*/vitest.config.ts",
  "infra/vitest.config.ts",
  "apps/web/vitest.config.ts",
]);
