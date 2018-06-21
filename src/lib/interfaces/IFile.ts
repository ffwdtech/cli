import IFileParams from "./IFileParams";

interface IFile {
  path: string,
  params: IFileParams,
  contents: string
};

export { IFile };
export default IFile;