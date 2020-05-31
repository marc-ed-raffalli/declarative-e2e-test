import {NextFunction, Request, Response} from 'express';
import {ErrorHandler} from '../../middlewares/error';
import {getUserProfile} from '../../services';

export async function profileRoute(req: Request, res: Response, next: NextFunction) {
  const
    username = req.params.username,
    currentUser = res.locals.user.username,
    isAdmin = getUserProfile(currentUser).role === 'admin';

  if (!isAdmin && username !== currentUser) {
    return next(new ErrorHandler(403));
  }

  res.send(getUserProfile(username));
}
