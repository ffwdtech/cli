declare function transform({input, options}: any, cb: any): Promise<{
    contents: any;
    sourcemap: any;
}>;
export { transform };
export default transform;
