import express from 'express';
import {applyEndMiddlewares, applyMiddlewares} from './middlewares';
import {applyRoutes} from './routes';
import {Logger} from './services/logger';

Logger.setLogLevel('SILENT');

export const app = express();

applyMiddlewares(app);
applyRoutes(app);
applyEndMiddlewares(app);
