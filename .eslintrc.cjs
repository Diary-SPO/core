module.exports = {
  extends: ['eslint:recommended', 'plugin:preact/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['@typescript-eslint', 'preact', 'prettier'],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "prettier/prettier": "error",
    "prefer-arrow-callback": "error",
    "react/jsx-no-bind": "off",
    "no-console": "off",
  },
  settings: {
    react: {
      version: "^17.0",
    },
    jest: {
      version: 26,
    },
  },
};
