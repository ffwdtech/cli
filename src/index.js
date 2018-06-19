const path = require('path');
const debug = require('./lib/debug');
const Compiler = require('./lib/compiler');
const watch = require('node-watch');
const { performance } = require('perf_hooks');

const userDefinedSourceFolder = './src';
const rootFolder = process.cwd();
const sourceFolder = path.join(rootFolder, userDefinedSourceFolder || '.');

const folder = `${sourceFolder}/**/`;

const initFiles = [
  `${folder}*.js`,
  `${folder}*.jsx`,
  `${folder}*.html`,
  `${folder}*.css`
];

debug.log('Starting up..');

const perFileTransformers = [
  { 
    name: 'buble',
    options: {
      transforms: {
        modules: false
      }
    },
    extensions: ['.js', '.jsx'],
    transform: require('./lib/transformers/buble')
  }
];

const bundleTransformers = [
  {
    name: 'rollup',
    options: {
      inputOptions: {
        input: 'build/client/index.js',
        output: {
          experimentalCodeSplitting: true,
          experimentalDynamicImport: true,
          name: 'FFWDClientBundle',
        }
      },
      outputOptions: {
        file: 'dist/client/index.js',
        format: 'iife'
      }
    },
    targets: ['client'],
    transform: require('./lib/transformers/rollup')
  },
  {
    name: 'ffwd-bundle-transformer-server-express',
    options: {
    },
    targets: ['server'],
    transform: require('./lib/transformers/ffwd-bundle-transformer-server-express')
  }
];

const compiler = new Compiler({
  rootFolder,
  perFileTransformers,
  bundleTransformers
});

async function runWithPerformanceCalc(options) {
  var t0 = performance.now();
  await compiler.compile(options);
  var t1 = performance.now();
  debug.log(`Done in ${t1 - t0}ms.`);
}

async function run() {
  
  debug.log('Doing initial compilation..');

  await runWithPerformanceCalc({
    sourceFiles: initFiles
  });

  debug.log('Initial compilation done. Starting file watcher.');

  watch(sourceFolder, { recursive: true }, async (evt, name) => {

    debug.log('--------------------------------------------------------------------------------');
    debug.log(`${name} changed. Recompiling bundle..`);

    await runWithPerformanceCalc({
      sourceFiles: initFiles
    });

  });

}

run();
