const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    files: ["**/*.ts"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      parser: tsParser, // 修正: パーサーオブジェクトを指定
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin, // 修正: pluginをオブジェクト形式で指定
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];