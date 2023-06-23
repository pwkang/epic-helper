import {IUser, IUserReminder, IUserReminderPropsCondition} from '@epic-helper/models';
import {Client} from 'discord.js';
import {_parseUser} from './parse-user';
import {_parseCommandString} from './parse-command-name';
import {_parseSlash} from './parse-slash';
import {getReminderMessageTemplate} from './get-reminder-message-template';
import {_parseEmoji} from './parse-emoji';
import {interpolateMessage} from '../../../../utils/message-interpolation';
import {BOT_CUSTOM_MESSAGE_VARIABLES} from '@epic-helper/constants';
import {convertNumToPetId, logger} from '@epic-helper/utils';
import timestampHelper from '../../../discordjs/timestamp';
import ms from 'ms';

interface IGenerateCustomMessage {
  client: Client;
  userId: string;
  userAccount: IUser;
  props?: IUserReminder['props'];
  type: IUserReminder['type'];
  nextReminder?: IUserReminder;
  nextPetIds?: number[];
}

export const generateUserReminderMessage = async ({
  userId,
  userAccount,
  client,
  props,
  type,
  nextReminder,
  nextPetIds,
}: IGenerateCustomMessage) => {
  const cmdName = _parseCommandString({
    type,
    props,
  } as IUserReminderPropsCondition);
  const hasSlash = userAccount.toggle.slash;
  const toMentions = userAccount.toggle.mentions[type];
  const hasEmoji = userAccount.toggle.emoji;
  const nextReminderTime = nextReminder?.readyAt
    ? timestampHelper.relative({
        time: nextReminder?.readyAt?.getTime(),
      })
    : '';
  const nextReminderType = nextReminder
    ? _parseCommandString({
        type: nextReminder.type,
        props: nextReminder.props,
      } as IUserReminderPropsCondition)
    : '';
  const nextReminderString = nextReminder
    ? `\`${nextReminderType}\` ready **${nextReminderTime}**`
    : '';
  const nextPetIdsString = nextPetIds?.map(convertNumToPetId).join(', ') ?? '';

  const variables: Partial<Record<ValuesOf<typeof BOT_CUSTOM_MESSAGE_VARIABLES>, string>> = {
    user: _parseUser({
      client,
      type: toMentions ? 'mentions' : 'username',
      userId,
    }),
    cmd_upper: cmdName.toUpperCase(),
    cmd_lower: cmdName.toLowerCase(),
    slash: hasSlash
      ? _parseSlash({
          type,
          props,
        } as IUserReminderPropsCondition)
      : '',
    emoji: hasEmoji ? _parseEmoji({type}) : '',
    next_reminder: nextReminderString,
    pet_id: nextPetIdsString,
  };

  const messageTemplate = await getReminderMessageTemplate({
    userAccount,
    userId,
    type,
  });
  logger({
    message: `messageTemplate: ${messageTemplate}`,
    logLevel: 'debug',
  });
  return interpolateMessage({
    message: messageTemplate,
    variables,
  });
};
