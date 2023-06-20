import {rpgCooldown} from '../../../../lib/epic-rpg/commands/account/cooldown';
import {updateReminderChannel} from '../../../../lib/epic-helper/reminders/reminder-channel';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgCooldown',
  commands: ['cooldowns', 'cooldown', 'cd'],
  type: PREFIX_COMMAND_TYPE.rpg,
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
