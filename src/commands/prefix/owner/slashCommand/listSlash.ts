import {BOT_COLOR, COMMAND_TYPE} from '../../../../constants/bot';
import {listSlashCommands} from '../../../../utils/listSlashCommands';
import {EmbedBuilder} from 'discord.js';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';
import {getGuildSlashCommands} from '../../../../lib/discord.js/slashCommands/getGuildSlashCommands.lib';
import {getGlobalSlashCommands} from '../../../../lib/discord.js/slashCommands/getGlobalSlashCommands.lib';

export default <PrefixCommand>{
  name: 'listSlash',
  commands: ['slash'],
  type: COMMAND_TYPE.dev,
  execute: async (client, message) => {
    const slashCommands = await listSlashCommands();
    const guildSlashCommands = await getGuildSlashCommands({client, guild: message.guild!});
    const globalSlashCommands = await getGlobalSlashCommands({client});

    const registeredGlobalSlashCommands: SlashCommand['name'][] = [];
    const registeredGuildSlashCommands: SlashCommand['name'][] = [];

    for (const slashCommand of slashCommands) {
      if (globalSlashCommands.find((gsc) => gsc.name === slashCommand.builder.name)) {
        registeredGlobalSlashCommands.push(slashCommand.name);
      }
      if (guildSlashCommands.find((gsc) => gsc.name === slashCommand.builder.name)) {
        registeredGuildSlashCommands.push(slashCommand.name);
      }
    }

    console.log({
      registeredGlobalSlashCommands,
      registeredGuildSlashCommands,
    });

    const embed = new EmbedBuilder()
      .setColor(BOT_COLOR.devEmbed)
      .setTitle('Slash Commands')
      .setDescription(
        `
\`\`\`
| global |  guild | name 
| --------------------------------
${slashCommands
  .map(
    (sc) =>
      `| ${registeredGlobalSlashCommands.includes(sc.name) ? '  ✓   ' : '  ✗   '} | ${
        registeredGuildSlashCommands.includes(sc.name) ? '  ✓   ' : '  ✗   '
      } | ${sc.name}`
  )
  .join('\n')}
\`\`\` 
      `
      )
      .addFields(
        {
          name: 'Commands',
          value: '`register [name1] [name2] ...`\n`delete [name1] [name2] ...`',
          inline: true,
        },
        {
          name: 'Flags',
          value: '`--guild` `--global`',
          inline: true,
        }
      );

    await sendMessage({
      client,
      options: {
        embeds: [embed],
      },
      channelId: message.channelId,
    });
  },
};
