import {IUser, IUserReminder} from '@epic-helper/models';
import {Client} from 'discord.js';
import {_parseUser} from './parse-user';
import {_parseCommandString} from './parse-command-name';
import {_parseSlash} from './parse-slash';
import {getReminderMessageTemplate} from './get-reminder-message-template';
import {_parseEmoji} from './parse-emoji';
import {interpolateMessage} from '../../../../utils/message-interpolation';
import {BOT_CUSTOM_MESSAGE_VARIABLES} from '@epic-helper/constants';
import {convertNumToPetId} from '@epic-helper/utils';
import timestampHelper from '../../../discordjs/timestamp';
import {IToggleUserCheckerReturnType} from '../../toggle-checker/user';

interface IGenerateCustomMessage {
  client: Client;
  userId: string;
  userAccount: IUser;
  userReminder: IUserReminder;
  type: IUserReminder['type'];
  nextReminder?: IUserReminder;
  readyPetsId?: number[];
  toggleChecker: IToggleUserCheckerReturnType;
}

export const generateUserReminderMessage = ({
  userId,
  userAccount,
  client,
  userReminder,
  type,
  nextReminder,
  readyPetsId,
  toggleChecker,
}: IGenerateCustomMessage) => {
  /**
   * Command String
   */
  const commandString = _parseCommandString({
    toggleChecker,
    ...userReminder,
  });

  /**
   * Countdown string to next reminder
   */
  const hasCountdown = toggleChecker?.countdown;
  const nextReminderTime = nextReminder?.readyAt
    ? timestampHelper.relative({
      time: nextReminder?.readyAt?.getTime(),
    })
    : '';
  const nextReminderType = nextReminder
    ? _parseCommandString({
      toggleChecker,
      ...nextReminder,
    })
    : '';
  const nextReminderString =
    hasCountdown && nextReminder ? `\`${nextReminderType}\` ready **${nextReminderTime}**` : '';

  /**
   * Ready Pets Ids
   */
  const readyPetIdsString = readyPetsId?.map(convertNumToPetId).join(', ') ?? '';

  /**
   * Emoji
   */
  const hasEmoji = toggleChecker?.emoji;
  const emojiString = hasEmoji ? _parseEmoji({type}) : '';

  /**
   * Slash Command
   */
  const hasSlash = toggleChecker?.slash;
  const slashCommandString = hasSlash ? _parseSlash(userReminder) : '';

  /**
   * User string
   */
  const toMentions = toggleChecker?.mentions[type];
  const userString = _parseUser({
    client,
    type: toMentions ? 'mentions' : 'username',
    userId,
  });

  const variables: Partial<Record<ValuesOf<typeof BOT_CUSTOM_MESSAGE_VARIABLES>, string>> = {
    user: userString,
    cmd_upper: commandString.toUpperCase(),
    cmd_lower: commandString.toLowerCase(),
    slash: slashCommandString,
    emoji: emojiString,
    next_reminder: nextReminderString,
    pet_id: readyPetIdsString,
  };

  const messageTemplate = getReminderMessageTemplate({
    userAccount,
    userId,
    type,
  });
  return interpolateMessage({
    message: messageTemplate,
    variables,
  });
};
