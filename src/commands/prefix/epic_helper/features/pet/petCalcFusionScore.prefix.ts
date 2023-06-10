import {COMMAND_TYPE} from '../../../../../constants/bot';
import generateFusionScoreEmbed from '../../../../../lib/epic_helper/features/pets/petCalcFusionScore.lib';
import sendMessage from '../../../../../lib/discord.js/message/sendMessage';

export default <PrefixCommand>{
  name: 'petCalcFusionScore',
  type: COMMAND_TYPE.bot,
  commands: ['petFuse', 'pf'],
  execute: async (client, message, args) => {
    const embeds = await generateFusionScoreEmbed({
      author: message.author,
      petIds: args,
    });
    sendMessage({
      client,
      options: {
        embeds,
      },
      channelId: message.channel.id,
    });
  },
};
