const LogTypes = {
  emergency: "emergency",
  alert: "alert",
  critical: "critical",
  error: "error",
  warn: "warn",
  notice: "notice",
  info: "info",
  log: "log",
  debug: "debug",
  trace: "trace"
};

module.exports = {

  _log(type, args) {
    const d = new Date();
    console.log(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} [${type}]`, args.join(' '));
  },
  
  emergency(...args)  { this._log(LogTypes.emergency, args); },
  alert(...args)      { this._log(LogTypes.alert, args); },
  critical(...args)   { this._log(LogTypes.critical, args); },
  error(...args)      { this._log(LogTypes.error, args); },
  warn(...args)       { this._log(LogTypes.warn, args); },
  notice(...args)     { this._log(LogTypes.notice, args); },
  info(...args)       { this._log(LogTypes.info, args); },
  warn(...args)       { this._log(LogTypes.warn, args); },
  log(...args)        { this._log(LogTypes.log, args); },
  debug(...args)      { this._log(LogTypes.debug, args); },
  trace(...args)      { this._log(LogTypes.trace, args); }
  
}