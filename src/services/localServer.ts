import * as express from "express";
import { Application, Route, Enums, Interfaces } from "ffwd";
import { debug } from "../lib/debug";

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

    this.webApp = express();
    this.app = app;
    this.port = port;
    this.ip = ip;

    return this;

  }

  setApp(app: Application) {
    this.app = app;
  }

  initialize() {

    const routeModules = this.app.getModulesByType({
      type: Enums.FFWDModuleType.Route
    });

    if(this.server) this.server.close();

    this.registerRoutesFromModules(routeModules);
    this.server = this.webApp.listen(this.port, () => debug.info(`Listening at http://${this.ip}:${this.port}`));

    return this;

  }

  registerRoutesFromModules(routeModules: Interfaces.IApplicationModule[]) {

    routeModules.forEach((routeModule: Interfaces.IApplicationModule) => {
      const route: Route = routeModule.moduleExports;
      debug.trace(`LocalServer.registerRoutesFromModules: Registering route ${route.uri} (${routeModule.name})`);
      this.webApp.route(route.uri).all(route.action);
    });

  }

}

export {
  ILocalServerConstructor,
  LocalServer
}

export default LocalServer;