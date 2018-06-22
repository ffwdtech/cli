import { Enums } from "ffwd";

interface IFileParams {
  moduleType?: Enums.FFWDModuleType,
  module?: Function
}

export { IFileParams };
export default IFileParams;