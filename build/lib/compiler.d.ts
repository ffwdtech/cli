/// <reference types="vinyl" />
import * as Vinyl from "vinyl";
import ICompilerConstructor from "./interfaces/ICompilerConstructor";
import ICompilerInput from "./interfaces/ICompilerInput";
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
    sourceBaseDirectory: string;
    outputDirectory: string;
    buildDirectory: string;
    perFileTransformers: any[];
    bundleTransformers: any[];
    bundles: any;
    buildId: string;
    constructor({rootFolder, perFileTransformers, bundleTransformers}: ICompilerConstructor);
    /**
     * Determine bundle target for a file (client, server or both)
     * @param {file} file A vinyl-fs file
     */
    determineBundleTarget(file: Vinyl): string;
    /**
     * Run the configured per-file transformers on a file in a stream
     * @param {vinyl-fs.file} inputFile  A vinyl-fs file
     */
    transformSourceFile(inputFile: any): Promise<any>;
    compile({sourceFilePaths}: ICompilerInput): Promise<{}>;
}
export { Compiler };
export default Compiler;
