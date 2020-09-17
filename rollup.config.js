import nodeResolve from '@rollup/plugin-node-resolve';
import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from 'rollup-plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import pkg from './package.json';
const destinationDirectory = 'lib';
const destinationFileName = 'bundle';
const INPUT_FILE_PATH = 'src/index.js';
const OUTPUT_NAME = 'trixtajs';

const makeExternalPredicate = (externalArr) => {
  if (!externalArr.length) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return (id) => pattern.test(id);
};

const deps = Object.keys(pkg.dependencies || {});
const peerDeps = Object.keys(pkg.peerDependencies || {});

const GLOBALS = makeExternalPredicate(deps.concat(peerDeps));

const createConfig = ({ input, output, external, env }) => ({
  input,
  output: {
    sourcemap: true,
    name: OUTPUT_NAME,
    globals: GLOBALS,
    ...output,
  },
  external: makeExternalPredicate(external === 'peers' ? peerDeps : deps.concat(peerDeps)),
  plugins: [
    excludeDependenciesFromBundle({ peerDependencies: true, dependencies: true }),
    env === 'production' && terser(),
    json({
      // All JSON files will be parsed by default,
      // but you can also specifically include/exclude files
      exclude: ['node_modules/**'],

      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: true, // Default: false

      // specify indentation for the generated default export —
      // defaults to '\t'
      indent: '  ',

      // ignores indent and generates the smallest code
      compact: true, // Default: false

      // generate a named export for every property of the JSON object
      namedExports: true, // Default: true
    }),
    commonjs(),
    filesize(),
    nodeResolve({
      jsnext: true,
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
    env &&
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
  ],
  onwarn(warning, warn) {
    if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
      return;
    }
    warn(warning);
  },
});

export default [
  createConfig({
    input: INPUT_FILE_PATH,
    output: {
      file: `${destinationDirectory}/${destinationFileName}.dev.esm.js`,
      format: 'es',
    },
    env: 'development',
  }),
  createConfig({
    input: INPUT_FILE_PATH,
    output: {
      file: pkg.module,
      format: 'es',
    },
    env: 'production',
  }),
  createConfig({
    input: INPUT_FILE_PATH,
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    env: 'production',
  }),
  createConfig({
    input: INPUT_FILE_PATH,
    output: {
      format: 'cjs',
      file: `${destinationDirectory}/${destinationFileName}.dev.cjs.js`,
    },
    env: 'development',
  }),
];
