"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors = require("colors/safe");
var LogTypes;
(function (LogTypes) {
    LogTypes["emergency"] = "emergency";
    LogTypes["alert"] = "alert";
    LogTypes["critical"] = "critical";
    LogTypes["error"] = "error";
    LogTypes["warn"] = "warn";
    LogTypes["notice"] = "notice";
    LogTypes["info"] = "info";
    LogTypes["log"] = "log";
    LogTypes["debug"] = "debug";
    LogTypes["trace"] = "trace";
})(LogTypes || (LogTypes = {}));
exports.LogTypes = LogTypes;
;
var LogColors;
(function (LogColors) {
    LogColors["emergency"] = "red";
    LogColors["alert"] = "red";
    LogColors["critical"] = "red";
    LogColors["error"] = "red";
    LogColors["warn"] = "yellow";
    LogColors["notice"] = "yellow";
    LogColors["info"] = "cyan";
    LogColors["log"] = "white";
    LogColors["debug"] = "gray";
    LogColors["trace"] = "gray";
})(LogColors || (LogColors = {}));
var debug = {
    _log: function (type, args) {
        var d = new Date();
        function s(_d) {
            return ("0" + _d.toString()).slice(-2);
        }
        console.log(colors[LogColors[type]](s(d.getHours()) + ":" + s(d.getMinutes()) + ":" + s(d.getSeconds()) + " [" + type + "]", args.join(' ')));
    },
    emergency: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.emergency, args);
    },
    alert: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.alert, args);
    },
    critical: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.critical, args);
    },
    error: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.error, args);
    },
    warn: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.warn, args);
    },
    notice: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.notice, args);
    },
    info: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.info, args);
    },
    log: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.log, args);
    },
    debug: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.debug, args);
    },
    trace: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(LogTypes.trace, args);
    }
};
exports.debug = debug;
exports.default = debug;
//# sourceMappingURL=debug.js.map