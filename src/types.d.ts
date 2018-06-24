declare module 'node-watch';
declare module 'buble';
declare module 'vinyl-write';
declare module 'rollup-plugin-vinyl';
declare module 'rollup-plugin-resolve';
declare module 'rollup-plugin-commonjs';
declare module 'rollup-plugin-uglify';
declare module 'rollup-plugin-node-resolve';
declare module 'require-from-string';

declare module "*.json" {
  const value: any;
  export default value;
}