import * as uuid from "uuid";

function requireFromString(src:string, filename:string) {
  var m = new module.constructor();
  m.paths = module.paths;
  m._compile(src, filename);
  return m.exports;
}

export default requireFromString;