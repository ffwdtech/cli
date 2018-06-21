interface IFile {
  path: string,
  params: object,
  contents: string,
  sourcemap?: string
};

export { IFile };
export default IFile;