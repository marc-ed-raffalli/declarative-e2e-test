import {Router} from 'express';
import {isAuthenticated} from '../../middlewares';
import {loginRoute} from './login';
import {logoutRoute} from './logout';

export const
  authRouter = Router()
    .post('/login', loginRoute)
    .delete('/logout', isAuthenticated, logoutRoute)
;
