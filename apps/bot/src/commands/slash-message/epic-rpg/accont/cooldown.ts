import {rpgCooldown} from '../../../../lib/epic-rpg/commands/account/cooldown';
import {updateReminderChannel} from '../../../../lib/epic-helper/reminders/reminder-channel';
import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgCooldown',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['cd'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgCooldown({
      client,
      author,
      message,
      isSlashCommand: true,
    });
    await updateReminderChannel({
      userId: author.id,
      channelId: message.channelId,
    });
  },
};
