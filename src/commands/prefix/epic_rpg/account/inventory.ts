import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgInventory, {isUserInventory} from '../../../../lib/epic_rpg/commands/account/inventory';

export default <PrefixCommand>{
  name: 'rpgInventory',
  commands: ['inventory', 'inv', 'i'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = await createRpgCommandListener({
      client,
      channelId: message.channel.id,
      author: message.author,
    });
    if (!event) return;
    event.on('embed', (embed) => {
      if (isUserInventory({embed, author: message.author})) {
        rpgInventory({
          author: message.author,
          embed,
        });
        event.stop();
      }
    });
  },
};
