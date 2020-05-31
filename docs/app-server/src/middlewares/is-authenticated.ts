import {NextFunction, Request, Response} from 'express';
import {isTokenValid, ITokenPayload} from '../services';
import {ErrorHandler} from './error';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const tokenData = res.locals.user as ITokenPayload;

  if (!tokenData || !isTokenValid(tokenData.username, tokenData.tokenId)) {
    return next(new ErrorHandler(401));
  }

  next();
}
