// eslint.config.js
const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  js.configs.recommended, // Use recommended rules from ESLint
  {
    languageOptions: {
      ecmaVersion: 2022, // Use modern ECMAScript features
      sourceType: "commonjs", // Assuming CommonJS modules for Node.js
      globals: {
        ...globals.node, // Add Node.js global variables
      },
    },
    rules: {
      // Add or override specific rules here if needed
      "no-unused-vars": "warn", // Warn about unused variables instead of erroring
      "no-console": "off", // Allow console.log for now during development
      "require-atomic-updates": "off" // Disable rule that might conflict with async handlers
    },
    ignores: ["node_modules/"], // Ignore the node_modules directory
  }
];

