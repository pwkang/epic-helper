import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import {
  getCalcInfo,
  getCalcInstructionMessage,
  getCalcMaterialMessage,
  getCalcSTTMessage,
  getInvalidCalcArgsMessage,
  isCalcMaterial,
  isCalcSTT,
} from '../../../../lib/epic_helper/features/calculator';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';
import replyMessage from '../../../../lib/discord.js/message/replyMessage';
import {isUserInventory} from '../../../../lib/epic_rpg/commands/account/inventory';

export default <PrefixCommand>{
  name: 'matsCalc',
  commands: ['calc', 'c'],
  type: COMMAND_TYPE.bot,
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
      if (isUserInventory({author: message.author, embed})) {
        event.stop();
        await sendMessage({
          client,
          channelId: message.channel.id,
          options: isCalcMaterial(args)
            ? getCalcMaterialMessage({embed, area: calcInfo.area ?? 0})
            : getCalcSTTMessage({embed, area: calcInfo.area ?? 0}),
        });
      }
    });
  },
};
