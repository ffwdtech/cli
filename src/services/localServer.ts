import * as express from "express";
import { Application, Route, Enums, Interfaces } from "ffwd";
import { debug } from "../lib/debug";
import { middleware } from "./middleware/index";

interface ILocalServerConstructor {
  app: Application,
  appConfiguration: any,
  ip: string,
  port: number
}

class LocalServer {

  app: Application;
  webApp: express.Application;
  ip: string;
  port: number;
  routes: Route[];
  server: any;

  constructor({
    app,
    appConfiguration,
    ip,
    port
  }: ILocalServerConstructor) {

    console.log("hi");

    this.app = app;
    this.port = port;
    this.ip = ip;

    return this;

  }

  setApp(app: Application) {
    this.app = app;
  }

  close() {
    if(this.server) {
      debug.info("Closing server");
      this.server.close();
      this.server = undefined;
    }
  }

  start() {

    this.close();

    this.webApp = express();

    // Register Express middleware
    middleware.forEach(fn => {
      this.webApp.use(fn);
    });

    // Register route modules from FFWD app
    this.registerRoutesFromModules(this.app.getModulesByType({
      type: Enums.FFWDModuleType.Route
    }));

    this.server = this.webApp.listen(this.port, () => debug.info(`Listening at http://${this.ip}:${this.port}`));

    return this;

  }

  registerRoutesFromModules(routeModules: Interfaces.IApplicationModule[]) {

    routeModules.forEach((routeModule: Interfaces.IApplicationModule) => {
      const route: Route = routeModule.moduleExports;
      debug.trace(`LocalServer.registerRoutesFromModules: Registering route ${route.uri} (${routeModule.name})`, route.action);
      this.webApp.route(route.uri).all(route.action);
    });

  }

}

export {
  ILocalServerConstructor,
  LocalServer
}

export default LocalServer;