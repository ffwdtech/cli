interface ICompilerConstructor {
    rootFolder: string;
    perFileTransformers: any[];
    bundleTransformers: any[];
}
export { ICompilerConstructor };
export default ICompilerConstructor;
