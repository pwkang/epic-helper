import {BOT_COLOR, PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {broadcastEval} from '../../../utils/broadcast-eval';
import {EmbedBuilder} from 'discord.js';
import {djsMessageHelper} from '../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'eval',
  type: PREFIX_COMMAND_TYPE.dev,
  commands: ['eval'],
  preCheck: {},
  execute: async (client, message) => {
    const allShards = message.content.includes('--all');
    const shards =
      message.content
        .match(/--clusters ([\d,]+)/)?.[1]
        ?.split(',')
        ?.map(Number)
        ?.filter((num) => !isNaN(num)) ?? [];
    const evalStr = message.content
      .match('```js(.|\n)*```')?.[0]
      .replace(/```js|```/g, '');

    if (!allShards && !shards.length && !evalStr)
      return djsMessageHelper.send({
        client,
        options: {
          content: [
            'Usage:',
            '```',
            'eval --all --clusters 1,2,3',
            '`` `js',
            'console.log("Hello world")',
            '`` `',
            '```',
          ].join('\n'),
        },
        channelId: message.channel.id,
      });

    if (!evalStr) return message.reply('No eval string found');

    const results = await broadcastEval({
      client,
      fn: evalStr,
      target: allShards ? 'all' : shards.length ? shards : undefined,
    });

    const embed = new EmbedBuilder().setColor(BOT_COLOR.devEmbed);
    for (const result of results) {
      embed.addFields({
        name: `Cluster ${result.clusterId}`,
        value: `\`\`\`js\n${JSON.stringify(result.data).slice(0, 1000)}\`\`\``,
        inline: true,
      });
    }
    await djsMessageHelper.send({
      channelId: message.channel.id,
      options: {
        embeds: [embed],
      },
      client,
    });
  },
};
