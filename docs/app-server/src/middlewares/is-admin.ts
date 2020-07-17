import {NextFunction, Request, Response} from 'express';
import {Logger} from '../services/logger';
import {ErrorHandler} from './error';

const logger = Logger.getLogger();

/**
 * Must be used after the `isAuthenticated` middleware
 */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const tokenData = res.locals.user ;
  logger.trace(`Admin resource ${req.path} accessed by`, tokenData ? tokenData.username : undefined);

  if (tokenData.role !== 'admin') {
    return next(new ErrorHandler(401));
  }

  next();
}
