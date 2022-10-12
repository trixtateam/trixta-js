const path = require('path');
const prettierOptions = require(path.resolve(__dirname, 'prettier.config.js'));

module.exports = {
  root: true,
  extends: ['prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: { 'prettier/prettier': ['warn', prettierOptions] },
    },
  ],
  globals: {
    Dict: 'writable',
    Dictionary: 'writable',
  },
};
