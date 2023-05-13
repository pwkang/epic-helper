import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgCooldown, {
  isRpgCooldownResponse,
} from '../../../../lib/epic_rpg/commands/account/cooldown';

export default <PrefixCommand>{
  name: 'rpgCooldown',
  commands: ['cooldowns', 'cooldown', 'cd'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      client,
      channelId: message.channel.id,
      author: message.author,
    });
    if (!event) return;
    event.on('embed', async (embed) => {
      if (isRpgCooldownResponse({embed, author: message.author})) {
        await rpgCooldown({
          author: message.author,
          embed,
        });
        event.stop();
      }
    });
  },
};
