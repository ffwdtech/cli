const debug = require('./debug');
const H = require('highland');
const vfs = require('vinyl-fs');
const write = require('vinyl-write');
const Vinyl = require('vinyl');
const path = require('path');
const uuid = require('uuid');

const BundleTarget = require('./constants/BundleTarget');

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

  constructor({
    rootFolder,
    perFileTransformers,
    bundleTransformers
  }) {

    this.buildId = uuid.v4();

    this.sourceBaseDirectory = path.join(process.cwd(), './src');
    this.outputDirectory = path.join(rootFolder, './dist');
    this.buildDirectory = path.join(rootFolder, './build');
    this.perFileTransformers = perFileTransformers;
    this.bundleTransformers = bundleTransformers;
    this.bundles = {};

  }

  /**
   * Determine bundle target for a file (client, server or both)
   * @param {file} file A vinyl-fs file
   */
  determineBundleTarget(file) {

    let bundleTarget = BundleTarget.both; // Default to both targets

    if (file.path.includes('.client') || file.path.includes('/client/')) {
      bundleTarget = BundleTarget.client;
    }
    else if (file.path.includes('.server') || file.path.includes('/server/')) {
      bundleTarget = BundleTarget.server;
    }

    return bundleTarget;
    
  }

  /**
   * Run the configured transformers on a file in a stream
   * @param {vinyl-fs.file} file  A vinyl-fs file
   */
  async runTransformersOnFileStreamItem(file) {

    let input = {
      contents: file.contents.toString('utf8')
    };

    let output = input;

    //
    // Run per-file transformers
    //

    for (let transformer of this.perFileTransformers) {

      if (!transformer.extensions ||
        transformer.extensions.find(extension => file.path.endsWith(extension))) {

        debug.trace(`Applying transformer ${transformer.name} to file ${file.path}`);

        try {
          output = await transformer.transform({
            input: output.contents,
            options: transformer.options
          });
        }
        catch (e) {
          debug.error(e);
          reject(e);
        }

      }

    }

    // Create output buffer for file
    let outputContentsBuffer = Buffer.from(
      output.contents
    );

    // Determine bundle target (client, server or both)
    const bundleTarget = this.determineBundleTarget(file);

    //
    // Get the path difference between the source base directory and
    // the directory of the file currently being processed.
    // For example, if base is `/test/src` and file is at
    // `/test/src/foo/index.js`, this returns `/foo/index.js.`
    //

    const relativeSourceFilePath = file.path.substring(
      this.sourceBaseDirectory.length,
      file.path.length
    );

    const outputFilePath = path.join(
      this.buildDirectory,
      bundleTarget, // Add the bundle target in the output directory
      relativeSourceFilePath
    );

    const outputFile = {
      bundleTarget: bundleTarget,
      file: new Vinyl({
        cwd: file.cwd,
        base: this.buildDirectory,
        path: outputFilePath,
        contents: outputContentsBuffer,
        overwrite: true,
        sourcemaps: true
      })
    };

    return outputFile;

  }

  async compile({
    sourceFiles
  }) {

    return new Promise((resolve, reject) => {

      //
      // Wrap vinyl-fs with highland so we can do functional
      // operations on the vinyl stream.
      //

      const src = H(vfs.src(sourceFiles));

      //
      // Process affected files one-by-one.
      //

      src.errors((err) => {
        debug.error(err);
        reject(err);
      }).flatMap((file) => {
        return H((push, next) => {

          push(null, H(new Promise(async (res, rej) => {
            res(await this.runTransformersOnFileStreamItem(file));
          })));
          
          push(null, H.nil);

        });
      }).parallel(1024)
        .group('bundleTarget')
        .apply(async (files) => {

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
            files: files[BundleTarget.client].concat(files[BundleTarget.both]).map(targetAndFile => {
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
            files: files[BundleTarget.server].concat(files[BundleTarget.both]).map(targetAndFile => {
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

                  write(file, function (err) {
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

module.exports = Compiler;
