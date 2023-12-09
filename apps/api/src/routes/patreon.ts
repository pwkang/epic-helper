import type {Handler} from 'express';
import {updatePatrons} from '../utils/updatePatrons';

const PATREON_WEBHOOK_TOKEN = process.env.PATREON_WEBHOOK_TOKEN;

const post: Handler = async (req, res) => {
  if (req.query.token !== PATREON_WEBHOOK_TOKEN) return res.status(401).send('Unauthorized');

  await updatePatrons();

  res.send('OK');
};

export const patreonController = {
  post,
};
