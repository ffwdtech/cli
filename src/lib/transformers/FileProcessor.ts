import ITransform from "../interfaces/ITransform";
import IFile from "../interfaces/IFile";
import debug from "../debug";
import { Method, Route, Enums, Constants } from "ffwd";
import requireFromString from "../helpers/requireFromString";
import IFileParams from "../interfaces/IFileParams";
import { ITransformInput } from "../interfaces/ITransformInput";

async function transform({
  app,
  appConfiguration,
  file,
  options
}: ITransformInput, cb: any): Promise<IFile> {

  debug.trace(`Transformer FileProcessor running on ${JSON.stringify(file)} with options ${JSON.stringify(options)}`);

  if(file.path.endsWith(".js")) {

    const requiredModuleFromString = requireFromString(file.contents, file.path);

    if (requiredModuleFromString.default) {

      const newModule = requiredModuleFromString.default; // Required module
      const parentClassOfModule = Object.getPrototypeOf(newModule); // Get the class that this module (possibly) extends

      // Detect module instances
      Constants.ModuleTypesWithClasses.forEach((moduleTypeWithClass:any) => {

        console.log(newModule.name, Object.getPrototypeOf(newModule).name, moduleTypeWithClass.class.name);

        if (
          newModule.constructor === moduleTypeWithClass.class ||  // Instantiates a module (Route, Method, etc.)
          parentClassOfModule.name === moduleTypeWithClass.type   // Extends from a class (Entity, etc.) 
        ) {

          debug.debug(`Detected ${moduleTypeWithClass.type} module "${newModule.name}" at ${file.path}`);

        }

      });

      file.module = newModule; // Include module in the file object that is passed forward in the compilation process

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
