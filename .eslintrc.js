module.exports = {
  extends: [
    'plugin:jest/recommended',
    'prettier',
    'plugin:security/recommended',
  ],
  plugins: [
    'testing-library',
    'jest',
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
  },
}
