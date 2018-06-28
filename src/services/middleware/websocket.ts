import { Response, Request } from "express";

export default function websocket(req: Request, res: Response, next: Function) {
  next();
}