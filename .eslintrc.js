module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // General rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'off', // Use TypeScript version instead
    
    // TypeScript specific rules (basic ones that don't require type checking)
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // Import/export rules
    'import/no-unresolved': 'off', // Let TypeScript handle this
    'import/prefer-default-export': 'off',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js',
    '*.mjs',
    '*.cjs',
    '*.d.ts',
    'coverage/',
    '.turbo/',
    '.next/',
    'build/',
    'out/',
  ],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      rules: {
        // TypeScript specific rules for .ts/.tsx files
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
    {
      files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.tsx', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
