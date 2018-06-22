import { Application } from "ffwd/build/Application";

interface ICompilerConstructor {
  app: Application,
  appConfiguration: any,
  rootFolder: string,
  perFileTransformers: any[],
  bundleTransformers: any[]
};

export { ICompilerConstructor };
export default ICompilerConstructor;