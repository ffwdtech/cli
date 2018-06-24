import ITransformFile from "./ITransformFile";

interface ITransform {
  file: ITransformFile,
  options: object
};

export { ITransform };
export default ITransform;