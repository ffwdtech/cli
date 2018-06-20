"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogTypes;
(function (LogTypes) {
    LogTypes["EMERGENCY"] = "emergency";
    LogTypes["ALERT"] = "alert";
    LogTypes["CRITICAL"] = "critical";
    LogTypes["ERROR"] = "error";
    LogTypes["WARN"] = "warn";
    LogTypes["NOTICE"] = "notice";
    LogTypes["INFO"] = "info";
    LogTypes["LOG"] = "log";
    LogTypes["DEBUG"] = "debug";
    LogTypes["TRACE"] = "trace";
})(LogTypes || (LogTypes = {}));
exports.LogTypes = LogTypes;
;
var debug = {
    _log: function (type, args) {
        var d = new Date();
        console.log(d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " [" + type + "]", args.join(' '));
    },
    emergency: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.EMERGENCY, args);
    },
    alert: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.ALERT, args);
    },
    critical: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.CRITICAL, args);
    },
    error: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.ERROR, args);
    },
    warn: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.WARN, args);
    },
    notice: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.NOTICE, args);
    },
    info: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.INFO, args);
    },
    log: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.LOG, args);
    },
    debug: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.DEBUG, args);
    },
    trace: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.TRACE, args);
    }
};
exports.debug = debug;
exports.default = debug;
//# sourceMappingURL=debug.js.map