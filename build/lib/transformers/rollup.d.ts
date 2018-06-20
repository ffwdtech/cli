import IBundleTransformerInput from "../interfaces/IBundleTransformerInput";
declare function transform({target, contents, files}: IBundleTransformerInput, options: any): Promise<any>;
export { transform };
export default transform;
