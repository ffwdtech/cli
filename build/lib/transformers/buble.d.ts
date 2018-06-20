import ITransformerInput from "../interfaces/ITransformerInput";
declare function transform({input, options}: ITransformerInput, cb: any): Promise<{
    contents: any;
    sourcemap: any;
}>;
export { transform };
export default transform;
