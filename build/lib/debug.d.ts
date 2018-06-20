declare enum LogTypes {
    EMERGENCY = "emergency",
    ALERT = "alert",
    CRITICAL = "critical",
    ERROR = "error",
    WARN = "warn",
    NOTICE = "notice",
    INFO = "info",
    LOG = "log",
    DEBUG = "debug",
    TRACE = "trace",
}
declare const debug: {
    _log(type: any, args: any[]): void;
    emergency(...args: any[]): void;
    alert(...args: any[]): void;
    critical(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    notice(...args: any[]): void;
    info(...args: any[]): void;
    log(...args: any[]): void;
    debug(...args: any[]): void;
    trace(...args: any[]): void;
};
export { debug, LogTypes };
export default debug;
