import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgCooldown} from '../../../../lib/epic_rpg/commands/account/cooldown';
import {updateReminderChannel} from '../../../../lib/epic_helper/reminders/reminderChannel';

export default <SlashMessage>{
  name: 'rpgCooldown',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['cd'],
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
