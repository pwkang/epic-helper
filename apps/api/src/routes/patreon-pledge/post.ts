import {Handler, NextFunction, Request, Response} from 'express';
import {validatePatreonWebhook} from '../../utils/patreon/webhook';

const validatePatreonSignature: Handler = (req, res, next) => {
  const isValid = validatePatreonWebhook(req);
  if (!isValid) {
    return res.status(400).send('Invalid signature');
  }
  next();
};

export default <Handler[]>[
  validatePatreonSignature,
  (req, res, next) => {
    console.log(req.body);
    res.send('success');
  },
];
