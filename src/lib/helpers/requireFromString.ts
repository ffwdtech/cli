import * as uuid from "uuid";
import * as path from "path";

function requireFromString(src: string, filename: string) {

  // Create a new module
  var m = new module.constructor();

  //m.id = uuid.v4();

  m.filename = filename;

  // Get directory of file
  m.__dirname = path.dirname(filename);

  // Set search paths for other modules from regular `module` paths
  m.paths = module.paths.concat([
    m.__dirname,
    process.cwd(),
    path.join(process.cwd(), "node_modules")
  ]);

  console.log(m);

  m._compile(src, filename);
  return m.exports;
}

export default requireFromString;