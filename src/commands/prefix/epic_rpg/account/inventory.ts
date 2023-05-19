import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgInventory, {isUserInventory} from '../../../../lib/epic_rpg/commands/account/inventory';
import {
  getCalcInfo,
  getCalcMaterialMessage,
  isCalcMaterial,
} from '../../../../lib/epic_helper/features/calculator/calculator';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';

export default <PrefixCommand>{
  name: 'rpgInventory',
  commands: ['inventory', 'inv', 'i'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message, args) => {
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
        if (isCalcMaterial(args)) {
          const calcInfo = getCalcInfo(args);
          if (!calcInfo.area) return;
          const options = getCalcMaterialMessage({
            area: calcInfo.area,
            embed,
            author: message.author,
          });
          sendMessage({
            client,
            channelId: message.channel.id,
            options,
          });
        }
      }
    });
  },
};
