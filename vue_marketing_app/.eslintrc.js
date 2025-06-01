module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true, // Using ES2021 for modern ES features
  },
  extends: [
    'plugin:vue/vue3-essential', // Base Vue 3 rules
    'eslint:recommended'         // Standard ESLint recommended rules
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false, // Set to true if you have a babel.config.js or similar
    ecmaVersion: 'latest', // Or 12 (for ES2021), or 'latest'
    sourceType: 'module',
  },
  rules: {
    // Add any project-specific rules or overrides here.
    // For example, to suppress 'no-unused-vars' for now:
    // 'no-unused-vars': 'warn',
  }
};
