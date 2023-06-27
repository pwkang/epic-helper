import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import loadRoutes from './handler/routes.handler';
import {logger} from '@epic-helper/utils';

dotenv.config();

const API_PORT = process.env.API_PORT || 3000;

const app = express();
app.use(bodyParser.json());

loadRoutes().then((router) => {
  app.use('/', router);
  app.listen(API_PORT, () => {
    logger({
      message: `Server is listening on port ${API_PORT}`,
    });
  });
});
