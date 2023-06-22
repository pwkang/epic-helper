import {RPG_COMMAND_TYPE} from '../epic-rpg/rpg';
import {ValuesOf} from '../type';

export const BOT_REMINDER_DEFAULT_MESSAGES: Partial<
  Record<ValuesOf<typeof RPG_COMMAND_TYPE> | 'all', string>
> = {
  all: '{user}, **__{cmd_upper}__** {emoji} is ready!\n{next_reminder}',
  pet: '{user}, your pet(s) is ready to claim!\n`{pet_id}`',
} as const;

export const BOT_CUSTOM_MESSAGE_VARIABLES = {
  user: 'user',
  cmdLower: 'cmd_lower',
  cmdUpper: 'cmd_upper',
  emoji: 'emoji',
  slash: 'slash',
  petId: 'pet_id',
  nextReminderTime: 'next_reminder_time',
  nextReminderType: 'next_reminder_type',
} as const;
