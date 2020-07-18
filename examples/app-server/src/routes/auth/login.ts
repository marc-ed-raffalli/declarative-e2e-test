import {NextFunction, Request, Response} from 'express';
import {ErrorHandler} from '../../middlewares/error';
import {login} from '../../services';

export interface ILoginPayload {
  username: string;
  password: string;
}

export async function loginRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const {username, password} = req.body as ILoginPayload;

    if (!username || !password) {
      return next(new ErrorHandler(400));
    }

    const token = await login(username, password);

    return res.send({token});

  } catch (err) {
    next(err);
  }
}
