import {COMMAND_TYPE} from '../../../../constants/bot';
import {rpgCooldown} from '../../../../lib/epic_rpg/commands/account/cooldown';
import {updateReminderChannel} from '../../../../utils/reminderChannel';

export default <PrefixCommand>{
  name: 'rpgCooldown',
  commands: ['cooldowns', 'cooldown', 'cd'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgCooldown({
      author: message.author,
      message,
      isSlashCommand: false,
      client,
    });
    await updateReminderChannel({
      userId: message.author.id,
      channelId: message.channelId,
    });
  },
};
