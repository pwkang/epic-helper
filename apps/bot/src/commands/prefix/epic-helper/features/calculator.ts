import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import materialCalculator from '../../../../lib/epic-helper/features/calculator/material-calculator';
import {rpgInventoryChecker} from '../../../../lib/epic-rpg/commands/account/inventory';
import sttScoreCalculator from '../../../../lib/epic-helper/features/calculator/stt-score-calculator';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'matsCalc',
  commands: ['calc', 'c'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: (client, message, args) => {
    if (
      !sttScoreCalculator.isCalcSTT(args) &&
      !materialCalculator.isCalcMaterial(args)
    )
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

    let event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('embed', async (embed) => {
      if (
        rpgInventoryChecker.isUserInventory({author: message.author, embed})
      ) {
        event?.stop();
        let messageOptions;
        if (materialCalculator.isCalcMaterial(args)) {
          messageOptions = materialCalculator.getCalcMaterialMessage({
            embed,
            area: calcInfo.area ?? 0,
            author: message.author,
          });
        } else {
          messageOptions = sttScoreCalculator.getCalcSTTMessage({
            embed,
            area: calcInfo.area ?? 0,
            author: message.author,
            level: calcInfo.level ?? 0,
          });
        }
        await djsMessageHelper.send({
          client,
          channelId: message.channel.id,
          options: messageOptions,
        });
      }
    });
    event.on('end', () => {
      event = undefined;
    });
  },
};
