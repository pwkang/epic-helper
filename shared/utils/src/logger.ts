import * as dotenv from 'dotenv';
import {Client} from 'discord.js';
import pino, {Level, Logger} from 'pino';
import pretty from 'pino-pretty';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

interface ILogger {
  client?: Client;
  variant?: string;
  message: string;
  logLevel?: Level;
}

export const logger = ({client, message, variant, logLevel}: ILogger) => {
  let loggerChild: Logger;
  if (isProduction) {
    loggerChild = pino({});
    loggerChild.setBindings({
      clusterId: client?.cluster?.id,
      variant,
    });
  } else {
    const variantMsg = variant ? `${variant}: ` : '';
    const clusterMessage = client?.cluster ? `[Cluster ${client?.cluster?.id}] ` : '';
    loggerChild = pino(
      pretty({
        translateTime: 'SYS:yyyy-mm-dd hh:MM:ss TT',
        messageFormat: `${clusterMessage}${variantMsg}{msg}`,
      })
    );
  }

  log({
    message,
    loggerChild,
    logLevel: logLevel || 'info',
  });
};

interface ILog {
  message: string;
  logLevel?: Level;
  loggerChild: Logger;
}

const log = ({logLevel, loggerChild, message}: ILog) => {
  switch (logLevel) {
    case 'info':
      loggerChild.info(message);
      break;
    case 'error':
      loggerChild.error(message);
      break;
    case 'warn':
      loggerChild.warn(message);
      break;
    case 'debug':
      loggerChild.debug(message);
      break;
    case 'trace':
      loggerChild.trace(message);
      break;
    case 'fatal':
      loggerChild.fatal(message);
      break;
    default:
      loggerChild.info(message);
      break;
  }
};
