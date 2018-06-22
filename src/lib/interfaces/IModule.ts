import { Enums } from "ffwd";

interface IModule {
  path: string,
  moduleType?: Enums.FFWDModuleType,
  module?: Function,
  contents: string
};

export { IModule };
export default IModule;