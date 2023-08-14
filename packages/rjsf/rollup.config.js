import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
const config = require('kcd-scripts/dist/config/rollup.config.js');

const babelPluginIndex = config.plugins.findIndex(
  (plugin) => plugin.name === 'babel',
);
const cjsPluginIndex = config.plugins.findIndex(
  (plugin) => plugin.name === 'commonjs',
);
const replacePluginIndex = config.plugins.findIndex(
  (plugin) => plugin.name === 'replace',
);

config.plugins[replacePluginIndex] = babel({
  preventAssignment: true,
});
config.plugins[babelPluginIndex] = babel({
  babelHelpers: 'runtime',
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
});
config.plugins[cjsPluginIndex] = commonjs({
  include: /node_modules/,
  namedExports: {},
});

module.exports = config;
