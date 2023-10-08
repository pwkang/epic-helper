import type {IUser} from '@epic-helper/models';
import type {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {BOT_REMINDER_DEFAULT_MESSAGES} from '@epic-helper/constants';

interface IGetReminderMessageTemplate {
  userId: string;
  userAccount: IUser;
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
}

export const getReminderMessageTemplate = ({
  userAccount,
  type
}: IGetReminderMessageTemplate) => {
  const customMessage = userAccount.customMessage;
  return (
    customMessage[type] ??
    customMessage.all ??
    BOT_REMINDER_DEFAULT_MESSAGES[type] ??
    BOT_REMINDER_DEFAULT_MESSAGES.all
  );
};
