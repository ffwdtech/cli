import * as express from "express";
import * as ffwd from "ffwd";
import { Route, Enums, Interfaces } from "ffwd";
import { debug } from "../lib/debug";

interface ILocalServerConstructor {
  app: ffwd.Application,
  appConfiguration: any,
  ip: string,
  port: number
}

class LocalServer {

  app: express.Application;
  bindIp: string;
  bindPort: number;
  routes: Route[];

  constructor({
    app,
    appConfiguration,
    ip,
    port
  }: ILocalServerConstructor) {

    console.log("hi");

    this.app = express();
    const routeModules = app.getModulesByType({
      type: Enums.FFWDModuleType.Route
    });
    console.log(routeModules, app.modules, Enums.FFWDModuleType.Route);
    this.registerRoutesFromModules(routeModules);
    this.app.listen(port, () => debug.info(`Listening at http://${ip}:${port}`));


  }

  registerRoutesFromModules(routes: Interfaces.IApplicationModule[]) {

    routes.forEach((routeModule: Interfaces.IApplicationModule) => {
      const route: Route = routeModule.moduleExports;
      debug.trace(`Registering module ${route.uri} in Express`);
      this.app.route(route.uri).all(route.action);
    });

  }

}

export {
  ILocalServerConstructor,
  LocalServer
}

export default LocalServer;