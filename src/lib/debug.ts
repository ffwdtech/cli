enum LogTypes {
  EMERGENCY = "emergency",
  ALERT = "alert",
  CRITICAL = "critical",
  ERROR = "error",
  WARN = "warn",
  NOTICE = "notice",
  INFO = "info",
  LOG = "log",
  DEBUG = "debug",
  TRACE = "trace"
};

const debug = {

  _log(type: any, args: any[]) {
    const d = new Date();
    console.log(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} [${type}]`, args.join(' '));
  },
  
  emergency(...args: any[])  { this._log(LogTypes.EMERGENCY, args); },
  alert(...args: any[])      { this._log(LogTypes.ALERT, args); },
  critical(...args: any[])   { this._log(LogTypes.CRITICAL, args); },
  error(...args: any[])      { this._log(LogTypes.ERROR, args); },
  warn(...args: any[])       { this._log(LogTypes.WARN, args); },
  notice(...args: any[])     { this._log(LogTypes.NOTICE, args); },
  info(...args: any[])       { this._log(LogTypes.INFO, args); },
  log(...args: any[])        { this._log(LogTypes.LOG, args); },
  debug(...args: any[])      { this._log(LogTypes.DEBUG, args); },
  trace(...args: any[])      { this._log(LogTypes.TRACE, args); }
  
}

export {
  debug,
  LogTypes
};

export default debug;