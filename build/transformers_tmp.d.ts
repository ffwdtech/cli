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
