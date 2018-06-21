import * as buble from "buble";
import ITransform from "../interfaces/ITransform";
import debug from "../debug";

async function transform({
  input,
  options
}: any, cb: any) {

  debug.trace(`Transformer buble running on ${input} with options ${options}`);

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
