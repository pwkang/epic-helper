import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {logger} from '@epic-helper/utils';
import {healthCheckController} from './routes/health-check';
import {patreonController} from './routes/patreon';
import {redisClient} from '@epic-helper/services';

dotenv.config();

const API_PORT = process.env.API_PORT || 3000;

export const startServer = async () => {
  await redisClient.connect();

  const app = express();
  app.use(bodyParser.json());

  app.get('/', healthCheckController.get);

  app.post('/patreon-pledge', patreonController.post);

  app.listen(API_PORT, () => {
    logger({
      message: `Server is listening on port ${API_PORT}`,
    });
  });
};
