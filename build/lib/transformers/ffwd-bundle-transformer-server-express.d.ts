declare const H: any;
declare const debug: any;
declare const Vinyl: any;
declare const rollup: any;
declare const rollupVinyl: any;
declare const resolve: any;
declare const commonjs: any;
declare const uglify: any;
declare const FFWDFunctionType: {
    Route: string;
    Method: string;
};
declare function requireFromString(src: any, filename: any): any;
declare function runTransformersOnFileStreamItem({file, files, options}: {
    file: any;
    files: any;
    options: any;
}): Promise<{
    functionType: string;
    file: any;
}>;
