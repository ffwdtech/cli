import debug from "../debug";
import * as H from "highland";
import * as vfs from "vinyl-fs";
import * as write from "vinyl-write";
import * as Vinyl from "vinyl";
import * as path from "path";
import * as uuid from "uuid";

import { rollup } from "rollup";
import * as rollupVinyl from "rollup-plugin-vinyl";
import * as resolve from "rollup-plugin-node-resolve";
import * as commonjs from "rollup-plugin-commonjs";
import * as uglify from "rollup-plugin-uglify";
import IBundleTransformerInput from "../interfaces/IBundleTransformerInput";

/*
const FFWDFunctionType = {
  Route: "Route",
  Method: "Method"
}

function requireFromString(src:any, filename:string) {
  const Module = module.constructor;
  const m = new Module();
  m._compile(src, filename);
  return m;
}

async function runTransformersOnFileStreamItem({
  file,
  files,
  options
}: any) {

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

 /*
async function transform({
  target,
  contents,
  files
}: IBundleTransformerInput, options: any): Promise<any> {

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
      .apply(async (files:any) => {

        if (!files[FFWDFunctionType.Route]) files[FFWDFunctionType.Route] = [];
        if (!files[FFWDFunctionType.Method]) files[FFWDFunctionType.Method] = [];

        files = files[FFWDFunctionType.Route].concat(files[FFWDFunctionType.Method]).map((fileAndFunctionType:any) => fileAndFunctionType.file);

        resolve({
          bundle: contents,
          files: files
        });
      });

  });

}

export {
  transform
}

export default transform;
*/