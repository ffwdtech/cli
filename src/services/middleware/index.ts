import disableCache from "./disableCache";
import websocket from "./websocket";

const middleware = [
  disableCache,
  websocket
]

export {
  middleware
};