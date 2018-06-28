import { Response, Request } from "express";

export default function disableCache(req:Request, res:Response, next:Function) {
  res.set({
    "Cache-Control": "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
    "Expires": "-1",
    "Pragma": "no-cache"
  });
  next();
}