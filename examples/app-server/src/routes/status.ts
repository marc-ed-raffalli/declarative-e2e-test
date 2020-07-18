import {Request, Response} from 'express';

const started = new Date();

export function statusRoute(req: Request, res: Response) {
  return res
    .send({started, up: Date.now() - started.getTime()});
}
