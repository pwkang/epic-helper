import {COMMAND_TYPE} from '../../../../constants/bot';
import {listSlashCommands} from '../../../../utils/listSlashCommands';
import {deleteGuildSlashCommand} from '../../../../lib/discord.js/slashCommands/deleteGuildSlashCommand';
import {getGuildSlashCommands} from '../../../../lib/discord.js/slashCommands/getGuildSlashCommands.lib';
import {ApplicationCommand, Message} from 'discord.js';
import {getGlobalSlashCommands} from '../../../../lib/discord.js/slashCommands/getGlobalSlashCommands.lib';
import {deleteGlobalSlashCommand} from '../../../../lib/discord.js/slashCommands/deleteGlobalSlashCommand';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';
import editMessage from '../../../../lib/discord.js/message/editMessage';
import {sleep} from '../../../../utils/sleep';

export default <PrefixCommand>{
  name: 'deleteSlash',
  commands: ['slash delete'],
  type: COMMAND_TYPE.dev,
  execute: async (client, message, args) => {
    const slashCommands = await listSlashCommands();

    const isGuild = checkIsGuild(message);
    const isGlobal = checkIsGlobal(message);

    const commandsToDelete = slashCommands.filter((sc) => args.includes(sc.name));
    if (!commandsToDelete.length)
      return sendMessage({
        client,
        channelId: message.channel.id,
        options: {
          content: 'No commands to delete',
        },
      });
    if (!isGuild && !isGlobal) {
      return sendMessage({
        client,
        channelId: message.channel.id,
        options: {
          content: 'Please specify `--guild` or `--global`',
        },
      });
    }
    let deleted = 0;
    const sentMessage = await sendMessage({
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
      registeredGuildSlashCommands = await getGuildSlashCommands({
        guild: message.guild!,
        client,
      });
      for (let command of commandsToDelete) {
        const guildCommand = registeredGuildSlashCommands.find(
          (gsc) => gsc.name === command.builder.name
        );
        if (guildCommand)
          await deleteGuildSlashCommand({
            client,
            commandId: guildCommand.id,
            guild: message.guild!,
          });
        deleted++;
        await editMessage({
          client,
          message: sentMessage,
          options: {
            content: getStatusMessage(),
          },
        });
        await sleep(1000);
      }
    } else {
      registeredGlobalSlashCommands = await getGlobalSlashCommands({client});
      for (let command of commandsToDelete) {
        const globalCommand = registeredGlobalSlashCommands.find(
          (gsc) => gsc.name === command.builder.name
        );
        if (globalCommand)
          await deleteGlobalSlashCommand({
            client,
            commandId: globalCommand.id,
          });
        deleted++;
        await editMessage({
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
      return `Deleting ${commandsToDelete.length} slash commands..., (${deleted}/${commandsToDelete.length})`;
    }
  },
};

const checkIsGuild = (message: Message) => message.content.includes('--guild');
const checkIsGlobal = (message: Message) => message.content.includes('--global');
