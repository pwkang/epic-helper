import type {Handler} from 'express';

const healthCheck: Handler = (req, res) => {
  res.send('OK');
};


export const healthCheckController = {
  get: healthCheck,
};
