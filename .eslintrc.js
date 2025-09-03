// .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // 让 ESLint 和 Prettier 配合
  ],
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // JSX 属性必须换行，一行一个
    'react/jsx-max-props-per-line': ['error', {maximum: 1, when: 'always'}],

    // JS/TS 代码行宽放宽，和 Prettier 保持一致
    'max-len': ['error', {code: 200, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreComments: true}],

    // 其他你可能需要的习惯性规则
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要 import React
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
