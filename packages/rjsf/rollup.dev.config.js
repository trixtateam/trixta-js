import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import path from 'path';
import pkg from './package.json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import dotenv from 'dotenv';

const config = dotenv.config();

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/@trixtateam/trixta-js-rjsf.es.js',
      format: 'es',
      exports: 'auto',
    },
    {
      file: 'dist/@trixtateam/trixta-js-rjsf.cjs.js',
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
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      preferBuiltins: false,
      mainFields: ['module', 'main', 'jsnext', 'browser'],
    }),
    json(),
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
          dest: config.parsed.DEST_NODE_MODULES_FOLDER,
        },
      ],
      hook: 'buildEnd',
    }),
  ],
};
