/** @type {import("eslint").Linter.Config}*/
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
  ],
  rules: {
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: "./packages/shared",
            from: [
              "./packages/features",
              "./packages/entities",
              "./packages/infra",
              "./apps",
            ],
          },
          {
            target: "./packages/entities",
            from: ["./packages/features", "./packages/infra", "./apps"],
          },
          {
            target: "./packages/infra",
            from: ["./packages/features", "./apps"],
          },
          {
            target: "./packages/features/account-auth",
            from: ["./packages/infra", "./apps"],
          },
        ],
      },
    ],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports" },
    ],
    "@typescript-eslint/no-explicit-any": "error",
  },
};
