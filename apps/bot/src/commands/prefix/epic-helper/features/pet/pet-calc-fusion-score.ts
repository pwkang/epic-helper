import generateFusionScoreEmbed from '../../../../../lib/epic-helper/features/pets/pet-calc-fusion-score';
import {djsMessageHelper} from '../../../../../lib/discord.js/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'petCalcFusionScore',
  type: PREFIX_COMMAND_TYPE.bot,
  commands: ['petFuse', 'petFusion', 'pf'],
  execute: async (client, message, args) => {
    const embeds = await generateFusionScoreEmbed({
      author: message.author,
      petIds: args,
    });
    djsMessageHelper.send({
      client,
      options: {
        embeds,
      },
      channelId: message.channel.id,
    });
  },
};
