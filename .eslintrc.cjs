module.exports = {
  extends: ['eslint:recommended', 'plugin:preact/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['@typescript-eslint', 'preact'],
  rules: {
    // Ваши правила ESLint здесь
  },
};
