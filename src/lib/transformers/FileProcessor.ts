import ITransform from "../interfaces/ITransform";
import ITransformFile from "../interfaces/ITransformFile";
import debug from "../debug";
import * as path from "path";
import { Method, Route, Enums, Constants } from "ffwd";
import requireFromString from "../helpers/requireFromString";
import IFileParams from "../interfaces/IFileParams";
import { ITransformInput } from "../interfaces/ITransformInput";

async function transform({
  app,
  appConfiguration,
  file,
  options
}: ITransformInput, cb: any): Promise<ITransformFile> {

  debug.trace(`Transformer FileProcessor running on ${JSON.stringify(file)} with options ${JSON.stringify(options)}`);

  if(file.path.endsWith(".js")) {

    const requiredModuleFromString = requireFromString(file.contents, file.path);

    // We only look at the default export per file right now.
    if (requiredModuleFromString.default) {

      // Required module from code. 
      const newModule = requiredModuleFromString.default;

      // Get the class that this module (possibly) extends
      const parentClassOfModule = Object.getPrototypeOf(newModule);

      // Include module in the file object that is passed forward in the compilation process
      file.module = newModule;

      // Detect module instances.
      Constants.ModuleTypesWithClasses.forEach((moduleTypeWithClass:any) => {

        if (
          newModule.constructor === moduleTypeWithClass.class ||  // Instantiates a module (Route, Method, etc.)
          parentClassOfModule && parentClassOfModule.name === moduleTypeWithClass.type   // Extends from a class (Entity, etc.) 
        ) {

          debug.debug(`${moduleTypeWithClass.type} module "${newModule.name}" (type: ${newModule.constructor.name}, extends ${parentClassOfModule.name}) at ${file.path}`);

          // Register the module in the application.
          app.registerModule({
            name: newModule.name,
            type: moduleTypeWithClass.type,
            moduleClass: moduleTypeWithClass.class,
            moduleExports: newModule
          });

        }

      });

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
