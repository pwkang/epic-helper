import * as dotenv from 'dotenv';
import pino, {Level, Logger} from 'pino';
import pretty from 'pino-pretty';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

interface ILogger {
  variant?: string;
  message: any;
  logLevel?: Level;
}

export const logger = (props: ILogger | string) => {
  const isString = typeof props === 'string';
  if (isString && isProduction) return;
  const message = isString ? props : props.message;
  const variant = isString ? undefined : props.variant;
  const logLevel: Level = isString ? 'debug' : props.logLevel ?? 'info';

  let loggerChild: Logger;
  if (isProduction) {
    loggerChild = pino({});
    loggerChild.setBindings({
      variant,
    });
  } else {
    const variantMsg = variant ? `${variant}: ` : '';
    loggerChild = pino(
      pretty({
        translateTime: 'SYS:yyyy-mm-dd hh:MM:ss TT',
        messageFormat: `${variantMsg}{msg}`,
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
