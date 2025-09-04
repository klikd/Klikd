module.exports = {
  extends: [
    '../../.eslintrc.js'
  ],
  rules: {
    // Explorer console specific rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': 'off' // Allow console logs in console apps
  }
};
