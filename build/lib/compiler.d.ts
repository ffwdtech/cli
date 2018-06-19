declare const debug: any;
declare const H: any;
declare const vfs: any;
declare const write: any;
declare const Vinyl: any;
declare const path: any;
declare const uuid: any;
declare const BundleTarget: any;
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
declare class Compiler {
    constructor({rootFolder, perFileTransformers, bundleTransformers}: {
        rootFolder: any;
        perFileTransformers: any;
        bundleTransformers: any;
    });
    /**
     * Determine bundle target for a file (client, server or both)
     * @param {file} file A vinyl-fs file
     */
    determineBundleTarget(file: any): any;
    /**
     * Run the configured transformers on a file in a stream
     * @param {vinyl-fs.file} file  A vinyl-fs file
     */
    runTransformersOnFileStreamItem(file: any): Promise<{
        bundleTarget: any;
        file: any;
    }>;
    compile({sourceFiles}: {
        sourceFiles: any;
    }): Promise<{}>;
}
