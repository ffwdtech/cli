import debug from "./debug";
import * as H from "highland";
import * as vfs from "vinyl-fs";
import * as write from "vinyl-write";
import * as Vinyl from "vinyl";
import * as path from "path";
import * as uuid from "uuid";

import BundleTarget from "./enums/BundleTarget";
import ICompilerConstructor from "./interfaces/ICompilerConstructor";
import ICompilerInput from "./interfaces/ICompilerInput";

import ITransform from "./interfaces/ITransform";
import IFile from "./interfaces/IFile";

/**
 * 
 * FFWD compiler.
 * There is a per-file transformation phase, which groups the files in three
 * categories: `client`, `server` and `both`.
 * 
 * The bundler step after that takes the files and puts them in two bundles
 * for client and server, merging the files in the `both` categories to both.
 * 
 */
class Compiler {

  sourceBaseDirectory: string;
  outputDirectory: string;
  buildDirectory: string;
  perFileTransformers: any[];
  bundleTransformers: any[];
  bundles: any;
  buildId: string;

  constructor({
    rootFolder,
    perFileTransformers,
    bundleTransformers
  }: ICompilerConstructor) {

    this.buildId = uuid.v4();

    this.sourceBaseDirectory = path.join(process.cwd(), './src');
    this.outputDirectory = path.join(rootFolder, './ffwd-dist');
    this.buildDirectory = path.join(rootFolder, `./ffwd-build`);
    this.perFileTransformers = perFileTransformers;
    this.bundleTransformers = bundleTransformers;
    this.bundles = {};

  }

  /**
   * Determine bundle target for a file (client, server or both)
   * @param {file} file A vinyl-fs file
   */
  determineBundleTarget(file:Vinyl) {

    let bundleTarget = BundleTarget.both; // Default to both targets

    if (file.path.includes('.client') || file.path.includes('/client/')) {
      bundleTarget = BundleTarget.client;
    }
    else if (file.path.includes('.server') || file.path.includes('/server/')) {
      bundleTarget = BundleTarget.server;
    }

    return bundleTarget.toString();
    
  }

  /**
   * Run the configured per-file transformers on a file in a stream
   * @param {vinyl-fs.file} inputFile  A vinyl-fs file
   */
  async transformSourceFile(inputFile:any):Promise<any> {

    let outputFile: IFile = {
      path: inputFile.path,
      params: {},
      sourcemap: null,
      contents: inputFile.contents.toString('utf8')
    };

    //
    // Run per-file transformers
    //

    for (let transformer of this.perFileTransformers) {

      if (!transformer.extensions ||
        transformer.extensions.find((extension: string) => inputFile.path.endsWith(extension))) {

        debug.debug(`Applying transformer ${transformer.name} to file ${outputFile.path}`);

        try {
          outputFile = await transformer.transform({
            file: outputFile,
            options: transformer.options
          });
        }
        catch (e) {
          debug.error(e);
        }

      }

    }

    // Create output buffer for file that Vinyl can use
    let outputContentsBuffer = Buffer.from(
      outputFile.contents
    );

    // Determine bundle target (client, server or both)
    const bundleTarget = this.determineBundleTarget(inputFile);

    //
    // Get the path difference between the source base directory and
    // the directory of the file currently being processed.
    // For example, if base is `/test/src` and file is at
    // `/test/src/foo/index.js`, this returns `/foo/index.js.`
    //

    const relativeSourceFilePath = inputFile.path.substring(
      this.sourceBaseDirectory.length,
      inputFile.path.length
    );

    const outputFilePath = path.join(
      this.buildDirectory,
      bundleTarget, // Add the bundle target in the output directory
      relativeSourceFilePath
    );

    return {
      bundleTarget: bundleTarget,
      file: new Vinyl({
        cwd: inputFile.cwd,
        base: this.buildDirectory,
        path: outputFilePath,
        contents: outputContentsBuffer,
        overwrite: true,
        sourcemaps: true
      })
    };

  }

  async compile({
    sourceFilePaths
  }: ICompilerInput) {

    return new Promise((resolve, reject) => {

      //
      // Wrap vinyl-fs with highland so we can do functional
      // operations on the vinyl stream.
      //

      const src = H(vfs.src(sourceFilePaths));

      src.errors((err: any) => {
        debug.error(err);
        reject(err);
      }).flatMap((sourceFile: any) => {
        return H((push: any, next: any) => {

          //
          // Process affected files one-by-one.
          //

          push(null, H(new Promise(async (res, rej) => {
            res(await this.transformSourceFile(sourceFile));
          })));
          
          push(null, H.nil);

        });
      }).parallel(1024)
        .group('bundleTarget')
        .apply(async (files:any) => {

          debug.trace('Starting bundle transformations.');

          //
          // Gather bundles
          //

          this.bundles = {};

          // Initialize empty arrays
          if (!files[BundleTarget.client]) files[BundleTarget.client] = [];
          if (!files[BundleTarget.server]) files[BundleTarget.server] = [];
          if (!files[BundleTarget.both]) files[BundleTarget.both] = [];

          this.bundles[BundleTarget.client] = {
            target: BundleTarget.client,
            contents: null,
            files: files[BundleTarget.client].concat(files[BundleTarget.both]).map((targetAndFile: any) => {
              const file = targetAndFile.file;
              return new Vinyl({
                cwd: file.cwd,
                base: file.base.replace('both', 'client'),
                path: file.path.replace('both', 'client'),
                contents: file.contents,
                overwrite: true,
                sourcemaps: true
              });
            })
          };

          this.bundles[BundleTarget.server] = {
            target: BundleTarget.server,
            contents: null,
            files: files[BundleTarget.server].concat(files[BundleTarget.both]).map((targetAndFile: any) => {
              const file = targetAndFile.file;
              return new Vinyl({
                cwd: file.cwd,
                base: file.base.replace('both', 'server'),
                path: file.path.replace('both', 'server'),
                contents: file.contents,
                overwrite: true,
                sourcemaps: true
              });
            })
          };

          //
          // Run bundle transformers
          //

          for (let bundleTransformer of this.bundleTransformers) {

            // Find out what targets this transformer has.
            // If not any use both client and server.

            const bundleTransformerTargets = bundleTransformer.targets && bundleTransformer.targets.length ? bundleTransformer.targets : [BundleTarget.client, BundleTarget.server];

            for (let target of bundleTransformerTargets) {

              debug.trace(`Applying transformer ${bundleTransformer.name} to bundle ${target}`);

              try {
                this.bundles[target] = Object.assign(
                  this.bundles[target],
                  await bundleTransformer.transform(
                    this.bundles[target],
                    bundleTransformer.options
                  )
                );
                debug.trace(`Applied transformer ${bundleTransformer.name} to bundle ${target}`);
              }
              catch (e) {
                debug.error(e);
                reject(e);
              }

            }

          }

          debug.trace('Bundle transformation done.');
          //console.log(this.bundles);

          for(let bundleKey in this.bundles) {

            const bundle = this.bundles[bundleKey];

            if(bundle.files && bundle.files.length) {
              for (let file of bundle.files) {

                // Replace "build" with "dist" in file path before writing
                file.cwd = file.cwd.replace(this.buildDirectory, this.outputDirectory);
                file.base = file.base.replace(this.buildDirectory, this.outputDirectory);
                file.path = file.path.replace(this.buildDirectory, this.outputDirectory);

                debug.trace(`Writing file ${file.path}`);

                await new Promise((re, rj) => {

                  write(file, function (err: any) {
                    if (err) {
                      debug.error(err);
                      rj(err);
                    }
                    else re();
                  });

                });

              }
            }

          }

          resolve();

        });

    });
    
  }

}

export {
  Compiler
};

export default Compiler;