import { Enums } from "ffwd";

interface ITransformFile {
  path: string,
  moduleType?: Enums.FFWDModuleType,
  module?: Function,
  contents: string
};

export { ITransformFile };
export default ITransformFile;