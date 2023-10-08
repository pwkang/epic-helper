import generateFusionScoreEmbed from '../../../../../lib/epic-helper/features/pets/pet-calc-fusion-score';
import {djsMessageHelper} from '../../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'petCalcFusionScore',
  type: PREFIX_COMMAND_TYPE.bot,
  commands: ['petFuse', 'petFusion', 'pf'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn
  },
  execute: async (client, message, args) => {
    const embeds = await generateFusionScoreEmbed({
      author: message.author,
      petIds: args
    });
    djsMessageHelper.send({
      client,
      options: {
        embeds
      },
      channelId: message.channel.id
    });
  }
};
