import * as express from "express";
import { Application, Route, Enums, Interfaces } from "ffwd";
import { debug } from "../lib/debug";
import { middleware } from "./middleware/index";
import * as jsdom from "jsdom";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";

import * as DOM from "react-dom-factories";

const body = DOM.body;
const div = DOM.div;
const script = DOM.script;

interface ILocalServerConstructor {
  app: Application,
  appConfiguration: any,
  ip: string,
  port: number
}

class MyComponent extends React.Component {
  render() {
    return `<div>Hello World</div>`;
  }
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

    // Initialize ffwd namespace for middleware in res
    this.webApp.use((req, res, next) => {
      res.ffwd = {
        currentRoute: null
      };
      next();
    });

    // Register Express middleware
    middleware.forEach(fn => {
      this.webApp.use(fn);
    });

    // Register route modules from FFWD app
    this.registerRoutesFromModules(this.app.getModulesByType({
      type: Enums.FFWDModuleType.Route
    }));

    this.webApp.use((req, res, next) => {
      //const dom = new JSDOM(`<!DOCTYPE html><head><title>${res.ffwd.currentRoute.name}</title></head><body><div id="__root"></div></body>`);
      //console.log(dom.window.document.querySelector("p").textContent); // "Hello world"
      //res.ffwd.dom = dom;
      //res.send(dom);
      const type = React.createElement(MyComponent);
      res.send(ReactDOMServer.renderToString(type));
      //next();
    });

    this.server = this.webApp.listen(this.port, () => debug.info(`Listening at http://${this.ip}:${this.port}`));

    return this;

  }

  registerRoutesFromModules(routeModules: Interfaces.IApplicationModule[]) {

    routeModules.forEach((routeModule: Interfaces.IApplicationModule) => {
      const route: Route = routeModule.moduleExports;
      debug.trace(`LocalServer.registerRoutesFromModules: Registering route ${route.uri} (${routeModule.name})`, route.action);
      this.webApp.route(route.uri).all(async (req, res, next) => {
        res.ffwd.currentRoute = route;
        await route.action(req, res);
        next();
      });
    });

  }

}

export {
  ILocalServerConstructor,
  LocalServer
}

export default LocalServer;