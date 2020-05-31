import {Express, Router} from 'express';
import {authRouter} from './auth';
import {statusRoute} from './status';
import {userRouter} from './user';

const
  apiRouter = Router()
    .use('/auth', authRouter)
    .use('/user', userRouter),
  appRouter = Router()
    .use('/api', apiRouter)
    .get('/', statusRoute)
;

export function applyRoutes(app: Express) {
  app.use(appRouter);
}
