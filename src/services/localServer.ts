import * as express from "express";
import * as ffwd from "ffwd";

interface ILocalServerConstructor {
  app: ffwd.Application,
  appConfiguration: any,
  ip: string,
  port: number
}

class LocalServer {

  app: express;
  bindIp: string;
  bindPort: number;
  routes: ffwd.Interfaces.IRoute[];

  constructor({
    app,
    appConfiguration,
    ip,
    port
  }: any) {

    console.log("hi");

    this.app = express();
    this.app.listen(port, () => console.log('Example app listening on port 3000!'))

  }

}

export default LocalServer;