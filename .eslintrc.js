const path = require('path');

const prettierOptions = require(path.resolve(__dirname, 'prettier.config.js'));

module.exports = {
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:jest/recommended', 'prettier', 'plugin:storybook/recommended'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: ['prettier', 'react', 'jest'],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    jest: true,
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'prettier/prettier': ['error', prettierOptions]
  },
  overrides: [{
    files: ['**/*.ts?(x)'],
    rules: {
      'prettier/prettier': ['warn', prettierOptions],
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'import/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-explicit-any': 1
    }
  }],
  globals: {
    Dict: 'writable',
    Dictionary: 'writable'
  }
};