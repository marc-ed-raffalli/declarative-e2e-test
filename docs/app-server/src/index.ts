import express from 'express';
import {applyEndMiddlewares, applyMiddlewares} from './middlewares';
import {applyRoutes} from './routes';

const
  app = express(),
  port = 3000;

applyMiddlewares(app);
applyRoutes(app);
applyEndMiddlewares(app);

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`
    Example app listening at http://127.0.0.1:${port}
    -------
    status route: /
  `);
});
