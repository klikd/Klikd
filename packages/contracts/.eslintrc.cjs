module.exports = {
  extends: [
    '../../.eslintrc.js'
  ],
  rules: {
    // Contracts specific rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
};
