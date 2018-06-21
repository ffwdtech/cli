import ITransform from "../interfaces/ITransform";
import IFile from "../interfaces/IFile";
import debug from "../debug";
import { Method, Route, Enums } from "ffwd";
import requireFromString from "../helpers/requireFromString";
import IFileParams from "../interfaces/IFileParams";

async function transform({
  file,
  options
}: ITransform, cb: any): Promise<IFile> {

  debug.trace(`Transformer FileCategorizer running on ${JSON.stringify(file)} with options ${JSON.stringify(options)}`);

  if(file.path.endsWith(".js")) {

    const requiredModule = requireFromString(file.contents, file.path);

    if (requiredModule.default) {

      const moduleDefaultExport = requiredModule.default;
      file.params.module = moduleDefaultExport;

      // Detect module instances

      switch (moduleDefaultExport.constructor) {
        case Route:
          file.params.moduleType = Enums.FFWDModuleType.Route;
          debug.debug(`Detected Route module "${moduleDefaultExport.name}" for URI "${moduleDefaultExport.uri}" at ${file.path}`);
          break;
        case Method:
          file.params.moduleType = Enums.FFWDModuleType.Method;
          debug.debug(`Detected Method module "${moduleDefaultExport.name}" at ${file.path}`);
          break;
        default:
          debug.debug(`File ${file.path} (constructor: ${moduleDefaultExport.constructor}) was not detected as a FFWD module. Extend the default export from a FFWD module to detect it.`);
          break;
      }

    }
    else {
      debug.trace(`Ignoring file ${file.path} as it has no default export`);
    }
    
  }
  

  return file;

}

export {
  transform
}

export default transform;
