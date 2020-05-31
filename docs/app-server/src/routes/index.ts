import {Express, Router} from 'express';
import {authRouter} from './auth';
import {statusRoute} from './status';
import {resetTestDataRoute} from './test-hooks';
import {userRouter} from './user';

const
  apiRouter = Router()
    .use('/auth', authRouter)
    .use('/user', userRouter)
    .post('/reset-test-data', resetTestDataRoute),
  appRouter = Router()
    .use('/api', apiRouter)
    .get('/', statusRoute)
;

export function applyRoutes(app: Express) {
  app.use(appRouter);
}
