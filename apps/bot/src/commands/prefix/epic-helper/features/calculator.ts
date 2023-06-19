import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import materialCalculator from '../../../../lib/epic-helper/features/calculator/material-calculator';
import {rpgInventoryChecker} from '../../../../lib/epic-rpg/commands/account/inventory';
import sttScoreCalculator from '../../../../lib/epic-helper/features/calculator/stt-score-calculator';
import {djsMessageHelper} from '../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'matsCalc',
  commands: ['calc', 'c'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: (client, message, args) => {
    if (!sttScoreCalculator.isCalcSTT(args) && !materialCalculator.isCalcMaterial(args))
      return djsMessageHelper.reply({
        client,
        message,
        options: materialCalculator.getInvalidCalcArgsMessage(),
      });

    djsMessageHelper.reply({
      client,
      message,
      options: materialCalculator.getCalcInstructionMessage(),
    });

    const calcInfo = sttScoreCalculator.getCalcInfo(args);

    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('embed', async (embed) => {
      if (rpgInventoryChecker.isUserInventory({author: message.author, embed})) {
        event.stop();
        await djsMessageHelper.send({
          client,
          channelId: message.channel.id,
          options: materialCalculator.isCalcMaterial(args)
            ? materialCalculator.getCalcMaterialMessage({
                embed,
                area: calcInfo.area ?? 0,
                author: message.author,
              })
            : sttScoreCalculator.getCalcSTTMessage({
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
