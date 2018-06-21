import ITransform from "../interfaces/ITransform";
import IFile from "../interfaces/IFile";
import debug from "../debug";

async function transform({
  file,
  options
}: ITransform, cb: any): Promise<IFile> {

  debug.trace(`Transformer FileCategorizer running on ${JSON.stringify(file)} with options ${JSON.stringify(options)}`);

  // Register Router instances

  

  return file;

}

export {
  transform
}

export default transform;
