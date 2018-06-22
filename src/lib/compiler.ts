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

import * as ffwd from "ffwd";
import ITransform from "./interfaces/ITransform";
import IModule from "./interfaces/IModule";
import { Application } from "ffwd/build/Application";

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

  app: Application;
  appConfiguration: any;
  sourceBaseDirectory: string;
  outputDirectory: string;
  buildDirectory: string;
  perFileTransformers: any[];
  bundleTransformers: any[];
  modules: any;
  buildId: string;

  constructor({
    app,
    appConfiguration,
    rootFolder,
    perFileTransformers,
    bundleTransformers
  }: ICompilerConstructor) {

    this.buildId = uuid.v4();

    this.app = app;
    this.appConfiguration = appConfiguration;

    this.sourceBaseDirectory = path.join(process.cwd(), './src');
    this.outputDirectory = path.join(rootFolder, './ffwd-dist');
    this.buildDirectory = path.join(rootFolder, `./ffwd-build`);
    this.perFileTransformers = perFileTransformers;
    this.bundleTransformers = bundleTransformers;

  }

  /**
   * Run the configured per-file transformers on a file in a stream
   * @param {vinyl-fs.file} inputFile  A vinyl-fs file
   */
  async perFileTransform(inputFile:any):Promise<any> {

    let outputModule: IModule = {
      path: inputFile.path,
      module: null,
      moduleType: null,
      contents: inputFile.contents.toString('utf8')
    };

    for (let transformer of this.perFileTransformers) {

      if (!transformer.extensions ||
        transformer.extensions.find((extension: string) => inputFile.path.endsWith(extension))) {

        debug.debug(`Applying transformer ${transformer.name} to file ${outputModule.path}`);

        try {
          outputModule = await transformer.transform({
            app: this.app,
            appConfiguration: this.appConfiguration,
            file: outputModule,
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
      outputModule.contents
    );

    // Get the path difference between the source base directory and
    // the directory of the file currently being processed.
    // For example, if base is `/test/src` and file is at
    // `/test/src/foo/index.js`, this returns `/foo/index.js.`

    const relativeSourceFilePath = inputFile.path.substring(
      this.sourceBaseDirectory.length,
      inputFile.path.length
    );

    const outputFilePath = path.join(
      this.buildDirectory,
      relativeSourceFilePath
    );

    return {
      module: outputModule,
      moduleType: outputModule.moduleType,
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

  /**
   * Compile all files in sourceFilePaths
   * @param {sourceFilePaths} string[]  Glob selector(s) with source file paths to compile into app
   */
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

          // Run per-file transformers

          push(null, H(new Promise(async (res, rej) => {
            res(await this.perFileTransform(sourceFile));
          })));
          
          push(null, H.nil);

        });

      }).parallel(1024)
        .group("moduleType")
        .apply(async (files:any) => {

          debug.trace("Registering modules.");

          //
          // Gather modules
          //

          this.modules = {};

          console.log(files);

          ffwd.Enums.FFWDModuleType.forEach((moduleType:string) => {
            
            this.app.registerModule(moduleType, )

          });

          /*

          this.modules[BundleTarget.client] = {
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

          this.modules[BundleTarget.server] = {
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
          */

          resolve();

        });

    });
    
  }

}

export {
  Compiler
};

export default Compiler;