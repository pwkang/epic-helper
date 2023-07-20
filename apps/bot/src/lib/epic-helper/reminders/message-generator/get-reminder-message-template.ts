import {IUser} from '@epic-helper/models';
import {BOT_REMINDER_DEFAULT_MESSAGES, RPG_COMMAND_TYPE} from '@epic-helper/constants';

interface IGetReminderMessageTemplate {
  userId: string;
  userAccount: IUser;
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
}

export const getReminderMessageTemplate = ({
  userAccount,
  userId,
  type,
}: IGetReminderMessageTemplate) => {
  const customMessage = userAccount.customMessage;
  return (
    customMessage[type] ??
    customMessage.all ??
    BOT_REMINDER_DEFAULT_MESSAGES[type] ??
    BOT_REMINDER_DEFAULT_MESSAGES.all
  );
};
