import {PREFIX_COMMAND_TYPE} from '../../../../../constants/bot';
import generateFusionScoreEmbed from '../../../../../lib/epic_helper/features/pets/petCalcFusionScore.lib';
import {djsMessageHelper} from '../../../../../lib/discord.js/message';

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
