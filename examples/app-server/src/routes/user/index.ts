import {Router} from 'express';
import {isAdmin, isAuthenticated} from '../../middlewares';
import {profileRoute} from './profile';
import {usersRoute} from './users';

export const
  userRouter = Router()
    .get('/profile/:username', isAuthenticated, profileRoute)
    .get('/users', [isAuthenticated, isAdmin], usersRoute)
;
