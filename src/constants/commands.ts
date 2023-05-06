import * as dotenv from 'dotenv';

dotenv.config();
export const PREFIX = {
  bot: process.env.BOT_PREFIX,
  dev: process.env.DEV_PREFIX,
  rpg: 'rpg ',
} as const;

export const COMMAND_TYPE = {
  rpg: 'rpg',
  dev: 'dev',
  bot: 'bot',
} as const;

export const EPIC_RPG_ID = '555955826880413696';

export const DEVS_ID = process.env.DEVS_ID?.split(',') ?? [];
