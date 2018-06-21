import * as colors from "colors/safe";

enum LogTypes {
  emergency = "emergency",
  alert = "alert",
  critical = "critical",
  error = "error",
  warn = "warn",
  notice = "notice",
  info = "info",
  log = "log",
  debug = "debug",
  trace = "trace"
};

enum LogColors {
  emergency = "red",
  alert = "red",
  critical = "red",
  error = "red",
  warn = "yellow",
  notice = "yellow",
  info = "cyan",
  log = "white",
  debug = "gray",
  trace = "gray"
}

const debug = {

  _log(type: any, args: any[]) {
    const d = new Date();
    function s(_d:number) {
      return ("0"+_d.toString()).slice(-2);
    }
    console.log(colors[LogColors[type]](`${s(d.getHours())}:${s(d.getMinutes())}:${s(d.getSeconds())} [${type}]`, args.join(' ')));
  },
  
  emergency(...args: any[])  { this._log(LogTypes.emergency, args); },
  alert(...args: any[])      { this._log(LogTypes.alert, args); },
  critical(...args: any[])   { this._log(LogTypes.critical, args); },
  error(...args: any[])      { this._log(LogTypes.error, args); },
  warn(...args: any[])       { this._log(LogTypes.warn, args); },
  notice(...args: any[])     { this._log(LogTypes.notice, args); },
  info(...args: any[])       { this._log(LogTypes.info, args); },
  log(...args: any[])        { this._log(LogTypes.log, args); },
  debug(...args: any[])      { this._log(LogTypes.debug, args); },
  trace(...args: any[])      { this._log(LogTypes.trace, args); }
  
}

export {
  debug,
  LogTypes
};

export default debug;