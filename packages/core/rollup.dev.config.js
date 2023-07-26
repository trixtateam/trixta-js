import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import path from 'path';
import pkg from './package.json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/@trixtateam/trixta-js-core.es.js',
      format: 'es',
      exports: 'auto',
    },
    {
      file: 'dist/@trixtateam/trixta-js-core.cjs.js',
      format: 'cjs',
    },
  ],
  external: Object.keys(pkg.peerDependencies || {}),
  plugins: [
    replace({
      preventAssignment: true,
    }),
    nodePolyfills(),
    resolve({
      extensions: ['.ts', '.tsx'],
      mainFields: ['module', 'main', 'jsnext', 'browser'],
      preferBuiltins: false,
    }),
    commonjs({
      requireReturnsDefault: 'auto',
      include: /node_modules/,
    }),
    babel({
      babelHelpers: 'runtime',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      configFile: path.resolve(__dirname, 'babel.config.cjs'),
      exclude: 'node_modules/**',
    }),
    copy({
      targets: [
        {
          src: 'dist/',
          dest:
            '/home/work/Workspace/Trixta/theia-trixta/theia-trixta-extension/node_modules/@trixtateam/trixta-js-core/',
        },
      ],
      hook: 'buildEnd',
    }),
  ],
};
