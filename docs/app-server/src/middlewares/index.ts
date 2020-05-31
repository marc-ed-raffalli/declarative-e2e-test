import compression from 'compression';
import {Express, json, NextFunction, Request, Response} from 'express';
import helmet from 'helmet';
import {ErrorHandler} from './error';
import {jwtCheck} from './jwt';

export * from './is-admin';
export * from './is-authenticated';

export function applyMiddlewares(app: Express) {
  app.use(helmet());
  app.use(json());
  app.use(jwtCheck);
  app.use(compression());
}

export function applyEndMiddlewares(app: Express) {
  app.use((req, res, next) => {
    res.set('Content-Type', 'application/json');
    next();
  });
  app.use((error: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    console.error('Error caught in middleware:', error);
    res.status(error.code).send({error});
  });
}
