import {Request, Response} from 'express';
import {getAllUsers} from '../../services';

export async function usersRoute(req: Request, res: Response) {
  const
    limit = parseInt(req.query.limit as string),
    offset = parseInt(req.query.offset as string),
    params = {
      limit: !isNaN(limit) ? limit : undefined,
      offset: !isNaN(offset) ? offset : undefined,
    };

  res.send(getAllUsers(params));
}
