import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
const destinationDirectory = 'lib';
const destinationFileName = 'bundle';
const INPUT_FILE_PATH = 'src/index.js';
const OUTPUT_NAME = 'trixtajs';
const extensions = ['.js'];
const EXTERNAL = Object.keys(pkg.dependencies);
const GLOBALS = EXTERNAL.map((key) => {
  switch (key) {
    case 'prop-types':
      return 'PropTypes';
    case 'immer':
      return 'immer';
    case 'redux-saga':
      return 'reduxsaga';
    case 'react-dom':
      return 'ReactDOM';
    case 'react':
      return 'React';
    case 'react-redux':
      return 'reactRedux';
    case '@trixta/phoenix-to-redux':
      return 'phoenixToRedux';
    default:
      return key;
  }
});
const BABEL_OPTIONS = {
  exclude: 'node_modules/**',
  babelHelpers: 'runtime',
};

const COMMON_PLUGINS = [
  commonjs(),
  filesize(),
  resolve({
    extensions,
    // pass custom options to the resolve plugin
    customResolveOptions: {
      moduleDirectory: 'node_modules',
    },
  }),
  babel({
    ...BABEL_OPTIONS,
  }),
];

const PLUGINS = COMMON_PLUGINS;
const PLUGINS_WITH_TERSER = [
  terser(),
  commonjs(),
  filesize(),
  resolve({
    extensions,
    // pass custom options to the resolve plugin
    customResolveOptions: {
      moduleDirectory: 'node_modules',
    },
  }),
  babel({
    ...BABEL_OPTIONS,
  }),
];
const OUTPUT_DATA = [
  {
    file: pkg.main,
    format: 'cjs',
    includeTerser: true,
  },
  {
    file: `${destinationDirectory}/${destinationFileName}.cjs.js`,
    format: 'cjs',
  },
  {
    file: pkg.browser,
    format: 'umd',
    includeTerser: true,
  },
  {
    file: `${destinationDirectory}/${destinationFileName}.umd.js`,
    format: 'umd',
  },
  {
    file: pkg.module,
    format: 'es',
    includeTerser: true,
  },
  {
    file: `${destinationDirectory}/${destinationFileName}.esm.js`,
    format: 'es',
  },
];

// https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
const CJS_AND_ES_EXTERNALS = EXTERNAL.concat(/@babel\/runtime/);
const config = OUTPUT_DATA.map(({ file, format, includeTerser }) => ({
  input: INPUT_FILE_PATH,
  output: {
    file,
    format,
    name: OUTPUT_NAME,
    globals: GLOBALS,
  },
  external: ['cjs', 'es'].includes(format) ? CJS_AND_ES_EXTERNALS : EXTERNAL,
  plugins: includeTerser ? PLUGINS_WITH_TERSER : PLUGINS,
}));

export default config;
