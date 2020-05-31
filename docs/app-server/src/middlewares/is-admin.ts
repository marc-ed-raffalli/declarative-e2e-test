import {NextFunction, Request, Response} from 'express';
import {ITokenPayload} from '../services';
import {ErrorHandler} from './error';

/**
 * Must be used after the `isAuthenticated` middleware
 */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const tokenData = res.locals.user as ITokenPayload;

  if (tokenData.role !== 'admin') {
    return next(new ErrorHandler(401));
  }

  next();
}
