module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "refactor", "docs", "test", "ci", "hotfix"],
    ],
    "subject-min-length": [2, "always", 10],
    "subject-case": [0],
  },
};
