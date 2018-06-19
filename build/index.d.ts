declare const path: any;
declare const debug: any;
declare const Compiler: any;
declare const watch: any;
declare const performance: any;
declare const userDefinedSourceFolder = "./src";
declare const rootFolder: string;
declare const sourceFolder: any;
declare const folder: string;
declare const initFiles: string[];
declare const perFileTransformers: {
    name: string;
    options: {
        transforms: {
            modules: boolean;
        };
    };
    extensions: string[];
    transform: any;
}[];
declare const bundleTransformers: ({
    name: string;
    options: {
        inputOptions: {
            input: string;
            output: {
                experimentalCodeSplitting: boolean;
                experimentalDynamicImport: boolean;
                name: string;
            };
        };
        outputOptions: {
            file: string;
            format: string;
        };
    };
    targets: string[];
    transform: any;
} | {
    name: string;
    options: {
        inputOptions?: undefined;
        outputOptions?: undefined;
    };
    targets: string[];
    transform: any;
})[];
declare const compiler: any;
declare function runWithPerformanceCalc(options: any): Promise<void>;
declare function run(): Promise<void>;
