const Vinyl = require('vinyl')
const rollup = require('rollup').rollup;
const rollupVinyl = require('rollup-plugin-vinyl');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const H = require('highland');
const path = require('path');

async function transform({
  target,
  contents,
  files
}, options) {

  const bundle = await rollup(
    Object.assign(
      options.inputOptions, 
      {
        plugins: [
          rollupVinyl({
            files: files
          }),
          resolve(),
          commonjs(),
          uglify()
        ]
      }
    )
  );

  const generated = await bundle.generate(options.outputOptions);

  const code = generated && generated.code ? generated.code : "";
  const base = `${files[0].cwd}/${path.parse(options.outputOptions.file).dir}`;
  const filePath = options.outputOptions.file;

  const returnFiles = [
    new Vinyl({
      cwd: files[0].cwd,
      base: base,
      path: filePath,
      contents: Buffer.from(code),
      overwrite: true,
      sourcemaps: true
    })
  ];

  //console.log("base:", base, "code:", code, "filePath:", filePath, "files:", returnFiles);

  return {
    contents: code,
    files: returnFiles
  };

}

module.exports = transform;