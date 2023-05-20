import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import {COMMAND_TYPE} from '../../../../constants/bot';
import {
  getEnchantType,
  isEnchantEquipmentBroken,
  isSuccessfullyEnchanted,
  rpgEnchant,
} from '../../../../lib/epic_rpg/commands/other/enchant.lib';

export default <PrefixCommand>{
  name: 'rpgEnchant',
  commands: ['enchant', 'refine', 'transmute', 'transcend'],
  type: COMMAND_TYPE.rpg,
  execute: (client, message) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('embed', async (embed) => {
      if (isSuccessfullyEnchanted({embed, author: message.author})) {
        event.stop();
        await rpgEnchant({
          client,
          channelId: message.channel.id,
          author: message.author,
          embed,
        });
      }
      if (isEnchantEquipmentBroken({embed})) {
        event.stop();
      }
    });
  },
};
