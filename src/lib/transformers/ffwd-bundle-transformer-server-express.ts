const H = require('highland');
const debug = require('../debug');

const Vinyl = require('vinyl')
const rollup = require('rollup').rollup;
const rollupVinyl = require('rollup-plugin-vinyl');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');

const FFWDFunctionType = {
  Route: "Route",
  Method: "Method"
}

function requireFromString(src, filename) {
  const Module = module.constructor;
  const m = new Module();
  m._compile(src, filename);
  return m;
}

async function runTransformersOnFileStreamItem({
  file,
  files,
  options
}) {

  const bundle = await rollup({
    input: file.path,
    plugins: [
      rollupVinyl({
        files: files
      }),
      resolve(),
      commonjs(),
      //uglify()
    ]
  });

  const generated = await bundle.generate({
    file: file.path,
    format: 'cjs'
  });

  //console.log(generated);

  //const fileContentsAsString = file.contents.toString('utf8');
  const fileAsModule = requireFromString(generated.code, file.path);
  if (fileAsModule.hi) fileAsModule.hello();

  console.log(file.path);

  // Find out functionType in source 

  return {
    functionType: FFWDFunctionType.Route,
    file: new Vinyl({
      cwd: file.cwd,
      base: file.base,
      path: file.path,
      contents: Buffer.from(generated.code)
    })
  };

}

/**
 * Bundle server items for use with Express
 * @param {Object} bundle         VFS bundle
 * @param {Object} bundle.target  Bundle target
 * @param {Object} bundle.bundle  Bundle code
 * @param {Object} bundle.files   Bundle files as VFS
 * @param {Object} options        Transformer options
 */
async function transform({
  target,
  bundle,
  files
}, options) {

  return new Promise((resolve, reject) => {

    const src = H(files);

    src.errors((err) => {
      debug.error(err);
      reject(err);
    })
      .flatMap((file) => {

        return H((push, next) => {
          push(null, H(new Promise(async (res, rej) => {
            res(await runTransformersOnFileStreamItem({ file, files, options }));
          })));

          push(null, H.nil);

        });

      })
      .parallel(1024)
      .group('functionType')
      .apply(async (files) => {

        if (!files[FFWDFunctionType.Route]) files[FFWDFunctionType.Route] = [];
        if (!files[FFWDFunctionType.Method]) files[FFWDFunctionType.Method] = [];

        files = files[FFWDFunctionType.Route].concat(files[FFWDFunctionType.Method]).map(fileAndFunctionType => fileAndFunctionType.file);

        resolve({
          bundle: bundle,
          files: files
        });
      });

  });

}

module.exports = transform;