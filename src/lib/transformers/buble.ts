import * as buble from "buble";
import ITransformerInput from "../interfaces/ITransformerInput";

async function transform({
  input,
  options
}: ITransformerInput, cb: any) {

  const transformedContents = buble.transform(input, options);

  if (!transformedContents) {
    throw new Error(`Couldn't transform file. Contents: \n${JSON.stringify(transformedContents, null, 2)}`);
  }

  if (!transformedContents.code) transformedContents.code = '';

  return {
    contents: transformedContents.code,
    sourcemap: transformedContents.map ? transformedContents.map : undefined
  };

}

export {
  transform
}

export default transform;
