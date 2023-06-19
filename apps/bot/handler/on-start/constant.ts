import * as dotenv from 'dotenv';

dotenv.config();

export const handlerRoot = process.env.ROOT || 'src';
const NODE_ENV = process.env.NODE_ENV || 'development';
const production = NODE_ENV === 'production';

export const handlerFileFilter = production ? '*.js' : '*.ts';
