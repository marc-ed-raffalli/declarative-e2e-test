import {Request, Response} from 'express';
import {getUserProfile} from '../../services';

export async function profileRoute(req: Request, res: Response) {
  res.send(getUserProfile(res.locals.user.username));
}
