
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
