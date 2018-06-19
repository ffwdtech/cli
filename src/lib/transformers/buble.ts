const buble = require('buble');

async function transform({
  input,
  options
}, cb) {

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

module.exports = transform;
