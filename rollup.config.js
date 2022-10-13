import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
const config = require('kcd-scripts/dist/config/rollup.config.js');

const babelPluginIndex = config.plugins.findIndex(
  (plugin) => plugin.name === 'babel',
);
const cjsPluginIndex = config.plugins.findIndex(
  (plugin) => plugin.name === 'commonjs',
);

config.plugins[babelPluginIndex] = babel({
  babelHelpers: 'runtime',
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
});
config.plugins[cjsPluginIndex] = commonjs({
  include: /node_modules/,
});

const format = config.output[0].format;
config.input = {
  [`trixta-js.${format}`]: config.input,
  [`rjsf/index.${format}`]: 'src/rjsf/index.ts',
};
config.output = {
  ...config.output[0],
  file: undefined,
  dir: 'dist',
};

module.exports = config;
