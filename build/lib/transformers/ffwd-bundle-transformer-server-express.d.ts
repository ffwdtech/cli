import IBundleTransformerInput from "../interfaces/IBundleTransformerInput";
/**
 * Bundle server items for use with Express
 * @param {Object} bundle         VFS bundle
 * @param {Object} bundle.target  Bundle target
 * @param {Object} bundle.bundle  Bundle code
 * @param {Object} bundle.files   Bundle files as VFS
 * @param {Object} options        Transformer options
 */
declare function transform({target, contents, files}: IBundleTransformerInput, options: any): Promise<any>;
export { transform };
export default transform;
