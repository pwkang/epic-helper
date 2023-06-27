import express from 'express';
import bodyParser from 'body-parser';
import {Request, Response} from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.post('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

const API_PORT = process.env.API_PORT || 3000;

app.listen(API_PORT, () => {
  console.log(`Server is listening on port ${API_PORT}`);
});
