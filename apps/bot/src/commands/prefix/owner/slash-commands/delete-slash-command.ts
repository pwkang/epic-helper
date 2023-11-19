import type {ApplicationCommand, Message} from 'discord.js';
import {sleep} from '@epic-helper/utils';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import djsRestHelper from '../../../../lib/discordjs/slash-commands';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'deleteSlash',
  commands: ['slash delete'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const isGuild = checkIsGuild(message);
    const isGlobal = checkIsGlobal(message);

    if (!isGuild && !isGlobal) {
      return djsMessageHelper.send({
        client,
        channelId: message.channel.id,
        options: {
          content: 'Please specify `--guild` or `--global`',
        },
      });
    }
    let deleted = 0;
    const sentMessage = await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: {
        content: getStatusMessage(),
      },
    });

    if (!sentMessage) return;

    let registeredGuildSlashCommands: ApplicationCommand[] = [];
    let registeredGlobalSlashCommands: ApplicationCommand[] = [];

    if (isGuild) {
      registeredGuildSlashCommands =
        await djsRestHelper.slashCommand.guild.getAll({
          guild: message.guild!,
          client,
        });
      for (const command of args) {
        const guildCommand = registeredGuildSlashCommands.find(
          (gsc) => gsc.name === command,
        );
        if (guildCommand)
          await djsRestHelper.slashCommand.guild.deleteOne({
            client,
            commandId: guildCommand.id,
            guild: message.guild!,
          });
        deleted++;
        await djsMessageHelper.edit({
          client,
          message: sentMessage,
          options: {
            content: getStatusMessage(),
          },
        });
        await sleep(1000);
      }
    } else {
      registeredGlobalSlashCommands =
        await djsRestHelper.slashCommand.global.getAll({client});
      for (const command of args) {
        const globalCommand = registeredGlobalSlashCommands.find(
          (gsc) => gsc.name === command,
        );
        if (globalCommand)
          await djsRestHelper.slashCommand.global.deleteOne({
            client,
            commandId: globalCommand.id,
          });
        deleted++;
        await djsMessageHelper.edit({
          client,
          message: sentMessage,
          options: {
            content: getStatusMessage(),
          },
        });
        await sleep(1000);
      }
    }

    function getStatusMessage() {
      return `Deleting slash commands... (${deleted} deleted)`;
    }
  },
};

const checkIsGuild = (message: Message) => message.content.includes('--guild');
const checkIsGlobal = (message: Message) =>
  message.content.includes('--global');
