import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
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

module.exports = config;
