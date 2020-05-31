import {Request, Response} from 'express';
import {resetTestDB} from '../services';

export function resetTestDataRoute(req: Request, res: Response) {
  console.log('Resetting demo test data');
  resetTestDB();

  return res.send({});
}
