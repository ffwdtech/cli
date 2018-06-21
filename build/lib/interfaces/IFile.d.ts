interface IFile {
    name: string;
    path: string;
    params: object;
    contents: string;
    sourcemap?: string;
}
export { IFile };
export default IFile;
