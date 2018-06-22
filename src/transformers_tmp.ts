
/**
 * Determine bundle target for a file (client, server or both)
 * @param {file} file A vinyl-fs file
 */
determineBundleTarget(file: Vinyl) {

  let bundleTarget = BundleTarget.both; // Default to both targets

  if (file.path.includes('.client') || file.path.includes('/client/')) {
    bundleTarget = BundleTarget.client;
  }
  else if (file.path.includes('.server') || file.path.includes('/server/')) {
    bundleTarget = BundleTarget.server;
  }

  return bundleTarget.toString();

}

// Determine bundle target (client, server or both)
const bundleTarget = this.determineBundleTarget(inputFile);


//////////////////////////////////////////

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
