module.exports = {
  extends: [
    '../../.eslintrc.js'
  ],
  rules: {
    // Figma MCP specific rules
    '@typescript-eslint/no-unused-vars': 'warn', // Change to warning for development
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn', // Change to warning for development
    'no-console': 'off', // Allow console logs in CLI tools
    'no-redeclare': 'warn', // Change to warning
    'no-import-assign': 'warn' // Change to warning
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      parserOptions: {
        project: null, // Disable project parsing for test files
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      }
    }
  ]
};
