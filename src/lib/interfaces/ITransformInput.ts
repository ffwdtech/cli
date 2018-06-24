import ITransformFile from "./ITransformFile";
import { Application } from "ffwd";

interface ITransformInput {
  app: Application,
  appConfiguration: any,
  file: ITransformFile,
  options: object
};

export { ITransformInput };
export default ITransformInput;