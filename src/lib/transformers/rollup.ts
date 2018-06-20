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

async function transform({
  target,
  contents,
  files
}: IBundleTransformerInput, options: any): Promise<any> {

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

export {
  transform
}

export default transform;