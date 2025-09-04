module.exports = {
  extends: [
    '../../../.eslintrc.js'
  ],
  rules: {
    // Mobile app specific rules - more lenient for development
    '@typescript-eslint/no-unused-vars': 'warn', // Change from error to warning
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn', // Change from error to warning
    'no-console': 'off', // Allow console logs in mobile app
    'no-undef': 'off', // Turn off no-undef for React Native globals
  },
  globals: {
    __DEV__: 'readonly',
  }
};
