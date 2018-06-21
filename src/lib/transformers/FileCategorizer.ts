import ITransform from "../interfaces/ITransform";
import IFile from "../interfaces/IFile";
import debug from "../debug";
import { Route } from "ffwd";
import requireFromString from "../helpers/requireFromString";

async function transform({
  file,
  options
}: ITransform, cb: any): Promise<IFile> {

  debug.trace(`Transformer FileCategorizer running on ${JSON.stringify(file)} with options ${JSON.stringify(options)}`);

  // Register Router instances

  if(file.path.endsWith(".js")) {
    const newModule = requireFromString(file.contents, file.path);
    console.log(newModule);
    
    if(newModule.default instanceof Route) {
      debug.debug(`Registering Route module ${file.path}`);
    }
    else if(newModule.default instanceof Route) {

    }

  }
  

  return file;

}

export {
  transform
}

export default transform;
