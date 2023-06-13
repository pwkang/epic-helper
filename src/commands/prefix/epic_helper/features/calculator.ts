import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../utils/createRpgCommandListener';
import {
  getCalcInstructionMessage,
  getCalcMaterialMessage,
  getInvalidCalcArgsMessage,
  isCalcMaterial,
} from '../../../../lib/epic_helper/features/calculator/materialCalculator';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';
import replyMessage from '../../../../lib/discord.js/message/replyMessage';
import {rpgInventoryChecker} from '../../../../lib/epic_rpg/commands/account/inventory';
import {
  getCalcInfo,
  getCalcSTTMessage,
  isCalcSTT,
} from '../../../../lib/epic_helper/features/calculator/sttScoreCalculator';

export default <PrefixCommand>{
  name: 'matsCalc',
  commands: ['calc', 'c'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: (client, message, args) => {
    if (!isCalcSTT(args) && !isCalcMaterial(args))
      return replyMessage({
        client,
        message,
        options: getInvalidCalcArgsMessage(),
      });

    replyMessage({
      client,
      message,
      options: getCalcInstructionMessage(),
    });

    const calcInfo = getCalcInfo(args);

    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('embed', async (embed) => {
      if (rpgInventoryChecker.isUserInventory({author: message.author, embed})) {
        event.stop();
        await sendMessage({
          client,
          channelId: message.channel.id,
          options: isCalcMaterial(args)
            ? getCalcMaterialMessage({embed, area: calcInfo.area ?? 0, author: message.author})
            : getCalcSTTMessage({
                embed,
                area: calcInfo.area ?? 0,
                author: message.author,
                level: calcInfo.level ?? 0,
              }),
        });
      }
    });
  },
};
