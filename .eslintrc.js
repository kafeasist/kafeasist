/** @type {import("eslint").Linter.Config} */

const config = {
  root: true,
  extends: ["@kafeasist/eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  settings: {
    next: {
      rootDir: ["apps/www"],
    },
  },
};

module.exports = config;
