"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("./debug");
var H = require("highland");
var vfs = require("vinyl-fs");
var write = require("vinyl-write");
var Vinyl = require("vinyl");
var path = require("path");
var uuid = require("uuid");
var BundleTarget_1 = require("./enums/BundleTarget");
/**
 *
 * FFWD compiler.
 * There is a per-file transformation phase, which groups the files in three
 * categories: `client`, `server` and `both`.
 *
 * The bundler step after that takes the files and puts them in two bundles
 * for client and server, merging the files in the `both` categories to both.
 *
 */
var Compiler = /** @class */ (function () {
    function Compiler(_a) {
        var rootFolder = _a.rootFolder, perFileTransformers = _a.perFileTransformers, bundleTransformers = _a.bundleTransformers;
        this.buildId = uuid.v4();
        this.sourceBaseDirectory = path.join(process.cwd(), './src');
        this.outputDirectory = path.join(rootFolder, './dist');
        this.buildDirectory = path.join(rootFolder, './build');
        this.perFileTransformers = perFileTransformers;
        this.bundleTransformers = bundleTransformers;
        this.bundles = {};
    }
    /**
     * Determine bundle target for a file (client, server or both)
     * @param {file} file A vinyl-fs file
     */
    Compiler.prototype.determineBundleTarget = function (file) {
        var bundleTarget = BundleTarget_1.default.both; // Default to both targets
        if (file.path.includes('.client') || file.path.includes('/client/')) {
            bundleTarget = BundleTarget_1.default.client;
        }
        else if (file.path.includes('.server') || file.path.includes('/server/')) {
            bundleTarget = BundleTarget_1.default.server;
        }
        return bundleTarget.toString();
    };
    /**
     * Run the configured transformers on a file in a stream
     * @param {vinyl-fs.file} file  A vinyl-fs file
     */
    Compiler.prototype.runTransformersOnFileStreamItem = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var input, output, _i, _a, transformer, e_1, outputContentsBuffer, bundleTarget, relativeSourceFilePath, outputFilePath, outputFile;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        input = {
                            contents: file.contents.toString('utf8')
                        };
                        output = input;
                        _i = 0, _a = this.perFileTransformers;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        transformer = _a[_i];
                        if (!(!transformer.extensions ||
                            transformer.extensions.find(function (extension) { return file.path.endsWith(extension); }))) return [3 /*break*/, 5];
                        debug_1.default.trace("Applying transformer " + transformer.name + " to file " + file.path);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, transformer.transform({
                                input: output.contents,
                                options: transformer.options
                            })];
                    case 3:
                        output = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        debug_1.default.error(e_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        outputContentsBuffer = Buffer.from(output.contents);
                        bundleTarget = this.determineBundleTarget(file);
                        relativeSourceFilePath = file.path.substring(this.sourceBaseDirectory.length, file.path.length);
                        outputFilePath = path.join(this.buildDirectory, bundleTarget, // Add the bundle target in the output directory
                        relativeSourceFilePath);
                        outputFile = {
                            bundleTarget: bundleTarget,
                            file: new Vinyl({
                                cwd: file.cwd,
                                base: this.buildDirectory,
                                path: outputFilePath,
                                contents: outputContentsBuffer,
                                overwrite: true,
                                sourcemaps: true
                            })
                        };
                        return [2 /*return*/, outputFile];
                }
            });
        });
    };
    Compiler.prototype.compile = function (_a) {
        var sourceFiles = _a.sourceFiles;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        //
                        // Wrap vinyl-fs with highland so we can do functional
                        // operations on the vinyl stream.
                        //
                        var src = H(vfs.src(sourceFiles));
                        //
                        // Process affected files one-by-one.
                        //
                        src.errors(function (err) {
                            debug_1.default.error(err);
                            reject(err);
                        }).flatMap(function (file) {
                            return H(function (push, next) {
                                push(null, H(new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _a = res;
                                                return [4 /*yield*/, this.runTransformersOnFileStreamItem(file)];
                                            case 1:
                                                _a.apply(void 0, [_b.sent()]);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })));
                                push(null, H.nil);
                            });
                        }).parallel(1024)
                            .group('bundleTarget')
                            .apply(function (files) { return __awaiter(_this, void 0, void 0, function () {
                            var _i, _a, bundleTransformer, bundleTransformerTargets, _b, bundleTransformerTargets_1, target, _c, _d, _e, _f, _g, e_2, _h, _j, _k, bundleKey, bundle, _loop_1, this_1, _l, _m, file;
                            return __generator(this, function (_o) {
                                switch (_o.label) {
                                    case 0:
                                        debug_1.default.trace('Starting bundle transformations.');
                                        //
                                        // Gather bundles
                                        //
                                        this.bundles = {};
                                        // Initialize empty arrays
                                        if (!files[BundleTarget_1.default.client])
                                            files[BundleTarget_1.default.client] = [];
                                        if (!files[BundleTarget_1.default.server])
                                            files[BundleTarget_1.default.server] = [];
                                        if (!files[BundleTarget_1.default.both])
                                            files[BundleTarget_1.default.both] = [];
                                        this.bundles[BundleTarget_1.default.client] = {
                                            target: BundleTarget_1.default.client,
                                            contents: null,
                                            files: files[BundleTarget_1.default.client].concat(files[BundleTarget_1.default.both]).map(function (targetAndFile) {
                                                var file = targetAndFile.file;
                                                return new Vinyl({
                                                    cwd: file.cwd,
                                                    base: file.base.replace('both', 'client'),
                                                    path: file.path.replace('both', 'client'),
                                                    contents: file.contents,
                                                    overwrite: true,
                                                    sourcemaps: true
                                                });
                                            })
                                        };
                                        this.bundles[BundleTarget_1.default.server] = {
                                            target: BundleTarget_1.default.server,
                                            contents: null,
                                            files: files[BundleTarget_1.default.server].concat(files[BundleTarget_1.default.both]).map(function (targetAndFile) {
                                                var file = targetAndFile.file;
                                                return new Vinyl({
                                                    cwd: file.cwd,
                                                    base: file.base.replace('both', 'server'),
                                                    path: file.path.replace('both', 'server'),
                                                    contents: file.contents,
                                                    overwrite: true,
                                                    sourcemaps: true
                                                });
                                            })
                                        };
                                        _i = 0, _a = this.bundleTransformers;
                                        _o.label = 1;
                                    case 1:
                                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                                        bundleTransformer = _a[_i];
                                        bundleTransformerTargets = bundleTransformer.targets && bundleTransformer.targets.length ? bundleTransformer.targets : [BundleTarget_1.default.client, BundleTarget_1.default.server];
                                        _b = 0, bundleTransformerTargets_1 = bundleTransformerTargets;
                                        _o.label = 2;
                                    case 2:
                                        if (!(_b < bundleTransformerTargets_1.length)) return [3 /*break*/, 7];
                                        target = bundleTransformerTargets_1[_b];
                                        debug_1.default.trace("Applying transformer " + bundleTransformer.name + " to bundle " + target);
                                        _o.label = 3;
                                    case 3:
                                        _o.trys.push([3, 5, , 6]);
                                        _c = this.bundles;
                                        _d = target;
                                        _f = (_e = Object).assign;
                                        _g = [this.bundles[target]];
                                        return [4 /*yield*/, bundleTransformer.transform(this.bundles[target], bundleTransformer.options)];
                                    case 4:
                                        _c[_d] = _f.apply(_e, _g.concat([_o.sent()]));
                                        debug_1.default.trace("Applied transformer " + bundleTransformer.name + " to bundle " + target);
                                        return [3 /*break*/, 6];
                                    case 5:
                                        e_2 = _o.sent();
                                        debug_1.default.error(e_2);
                                        reject(e_2);
                                        return [3 /*break*/, 6];
                                    case 6:
                                        _b++;
                                        return [3 /*break*/, 2];
                                    case 7:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 8:
                                        debug_1.default.trace('Bundle transformation done.');
                                        _h = [];
                                        for (_j in this.bundles)
                                            _h.push(_j);
                                        _k = 0;
                                        _o.label = 9;
                                    case 9:
                                        if (!(_k < _h.length)) return [3 /*break*/, 14];
                                        bundleKey = _h[_k];
                                        bundle = this.bundles[bundleKey];
                                        if (!(bundle.files && bundle.files.length)) return [3 /*break*/, 13];
                                        _loop_1 = function (file) {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        // Replace "build" with "dist" in file path before writing
                                                        file.cwd = file.cwd.replace(this_1.buildDirectory, this_1.outputDirectory);
                                                        file.base = file.base.replace(this_1.buildDirectory, this_1.outputDirectory);
                                                        file.path = file.path.replace(this_1.buildDirectory, this_1.outputDirectory);
                                                        debug_1.default.trace("Writing file " + file.path);
                                                        return [4 /*yield*/, new Promise(function (re, rj) {
                                                                write(file, function (err) {
                                                                    if (err) {
                                                                        debug_1.default.error(err);
                                                                        rj(err);
                                                                    }
                                                                    else
                                                                        re();
                                                                });
                                                            })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        };
                                        this_1 = this;
                                        _l = 0, _m = bundle.files;
                                        _o.label = 10;
                                    case 10:
                                        if (!(_l < _m.length)) return [3 /*break*/, 13];
                                        file = _m[_l];
                                        return [5 /*yield**/, _loop_1(file)];
                                    case 11:
                                        _o.sent();
                                        _o.label = 12;
                                    case 12:
                                        _l++;
                                        return [3 /*break*/, 10];
                                    case 13:
                                        _k++;
                                        return [3 /*break*/, 9];
                                    case 14:
                                        resolve();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    return Compiler;
}());
exports.Compiler = Compiler;
exports.default = Compiler;
//# sourceMappingURL=compiler.js.map