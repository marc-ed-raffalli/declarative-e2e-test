import {NextFunction, Request, Response} from 'express';
import {verify} from 'jsonwebtoken';
import {ITokenPayload, JWT_SECRET} from '../services';
import {Logger} from '../services/logger';
import {ErrorHandler} from './error';

const logger = Logger.getLogger();

/**
 * Simply checks if an "authorization" header is provided.
 * Verifies the payload and sets it to the response locals if so.
 */
export async function jwtCheck(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      logger.trace('No "authorization" header for request', req.path);
      return next();
    }

    const user = await verify(authorization, JWT_SECRET) as ITokenPayload;
    res.locals = {
      ...res.locals,
      user
    };
    logger.trace('Header "authorization" found for user:', user.username);

    next();

  } catch (err) {
    next(new ErrorHandler(500));
  }
}
