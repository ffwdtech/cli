var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var path = require('path');
var debug = require('./lib/debug');
var Compiler = require('./lib/compiler');
var watch = require('node-watch');
var performance = require('perf_hooks').performance;
var userDefinedSourceFolder = './src';
var rootFolder = process.cwd();
var sourceFolder = path.join(rootFolder, userDefinedSourceFolder || '.');
var folder = sourceFolder + "/**/";
var initFiles = [
    folder + "*.js",
    folder + "*.jsx",
    folder + "*.html",
    folder + "*.css"
];
debug.log('Starting up..');
var perFileTransformers = [
    {
        name: 'buble',
        options: {
            transforms: {
                modules: false
            }
        },
        extensions: ['.js', '.jsx'],
        transform: require('./lib/transformers/buble')
    }
];
var bundleTransformers = [
    {
        name: 'rollup',
        options: {
            inputOptions: {
                input: 'build/client/index.js',
                output: {
                    experimentalCodeSplitting: true,
                    experimentalDynamicImport: true,
                    name: 'FFWDClientBundle',
                }
            },
            outputOptions: {
                file: 'dist/client/index.js',
                format: 'iife'
            }
        },
        targets: ['client'],
        transform: require('./lib/transformers/rollup')
    },
    {
        name: 'ffwd-bundle-transformer-server-express',
        options: {},
        targets: ['server'],
        transform: require('./lib/transformers/ffwd-bundle-transformer-server-express')
    }
];
var compiler = new Compiler({
    rootFolder: rootFolder,
    perFileTransformers: perFileTransformers,
    bundleTransformers: bundleTransformers
});
function runWithPerformanceCalc(options) {
    return __awaiter(this, void 0, void 0, function () {
        var t0, t1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t0 = performance.now();
                    return [4 /*yield*/, compiler.compile(options)];
                case 1:
                    _a.sent();
                    t1 = performance.now();
                    debug.log("Done in " + (t1 - t0) + "ms.");
                    return [2 /*return*/];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debug.log('Doing initial compilation..');
                    return [4 /*yield*/, runWithPerformanceCalc({
                            sourceFiles: initFiles
                        })];
                case 1:
                    _a.sent();
                    debug.log('Initial compilation done. Starting file watcher.');
                    watch(sourceFolder, { recursive: true }, function (evt, name) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    debug.log('--------------------------------------------------------------------------------');
                                    debug.log(name + " changed. Recompiling bundle..");
                                    return [4 /*yield*/, runWithPerformanceCalc({
                                            sourceFiles: initFiles
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
run();
//# sourceMappingURL=index.js.map