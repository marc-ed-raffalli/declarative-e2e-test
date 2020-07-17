import {NextFunction, Request, Response} from 'express';
import {isTokenValid} from '../services';
import {Logger} from '../services/logger';
import {ErrorHandler} from './error';

const logger = Logger.getLogger();

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const tokenData = res.locals.user;
  logger.trace(`Reserved resource ${req.path} accessed by`, tokenData ? tokenData.username : undefined);

  if (!tokenData || !isTokenValid(tokenData.username, tokenData.tokenId)) {
    return next(new ErrorHandler(401));
  }

  next();
}
