import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgInventory, {isUserInventory} from '../../../../lib/epic_rpg/commands/account/inventory';
import {
  getCalcMaterialMessage,
  isCalcMaterial,
} from '../../../../lib/epic_helper/features/calculator/calcMats';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';
import {
  getCalcInfo,
  getCalcSTTMessage,
  isCalcSTT,
} from '../../../../lib/epic_helper/features/calculator/calcSTT';

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
        if (isCalcMaterial(args) || isCalcSTT(args)) {
          const calcInfo = getCalcInfo(args);
          if (!calcInfo.area) return;
          const options = isCalcMaterial(args)
            ? getCalcMaterialMessage({embed, area: calcInfo.area ?? 0, author: message.author})
            : getCalcSTTMessage({
                embed,
                area: calcInfo.area ?? 0,
                author: message.author,
                level: calcInfo?.level ?? 0,
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
