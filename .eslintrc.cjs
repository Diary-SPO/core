module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "preact"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  rules: {
    quotes: ['error', 'single'],
    semi: [1, 'always'],
    'max-len': ['warn', { code: 150 }],
  },
  overrides: [
    {
      files: ['bin/*.js', 'lib/*.js', '*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
    },
    {
      files: ['*.tsx', '*.ts'],
      rules: {
        'linebreak-style': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        'react/require-default-props': 'off',
        'react/jsx-fragments': 'off',
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
        // @see https://stackoverflow.com/questions/46735483/error-do-not-use-array-index-in-keys
        // Обычно так делать нельзя, но в рамках нашего проекта - можно
        // Т.к. наши массивы статичны и юзер не может как-либо менять порядок / удалять элементы,
        // мы можем использовать индекс как key
        'react/no-array-index-key': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        'no-nested-ternary': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-param-reassign': 'off',
        'max-classes-per-file': 'off',
        'jsx-quotes': [2, 'prefer-single'],
        'react/function-component-definition': [2, {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
        ],
      },
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  ],
};
