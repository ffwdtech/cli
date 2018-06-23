import IFile from "./IFile";
import { Application } from "ffwd/build/Application";

interface ITransformInput {
  app: Application,
  appConfiguration: any,
  file: IFile,
  options: object
};

export { ITransformInput };
export default ITransformInput;