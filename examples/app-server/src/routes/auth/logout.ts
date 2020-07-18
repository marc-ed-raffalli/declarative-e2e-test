import {Request, Response} from 'express';
import {logout} from '../../services';

export async function logoutRoute(req: Request, res: Response) {
  logout(res.locals.user.username, res.locals.user.tokenId);

  res.send({});
}
