import {NextFunction, Request, Response} from 'express';
import {verify} from 'jsonwebtoken';
import {ITokenPayload, JWT_SECRET} from '../services';
import {ErrorHandler} from './error';

/**
 * Simply checks if an "authorization" header is provided.
 * Verifies the payload and sets it to the response locals if so.
 */
export async function jwtCheck(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      console.log('No "authorization" header');
      return next();
    }

    const user = await verify(authorization, JWT_SECRET) as ITokenPayload;
    res.locals = {
      ...res.locals,
      user
    };
    console.log('Header "authorization" found for user', user.username);

    next();

  } catch (err) {
    next(new ErrorHandler(500));
  }
}
