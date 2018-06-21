import ITransform from "../interfaces/ITransform";
import IFile from "../interfaces/IFile";
declare function transform({file, options}: ITransform, cb: any): Promise<IFile>;
export { transform };
export default transform;
