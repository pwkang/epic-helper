import {COMMAND_TYPE} from '../../../../constants/bot';
import {listSlashCommands} from '../../../../utils/listSlashCommands';
import {createGuildSlashCommand} from '../../../../lib/discord.js/slashCommands/createGuildSlashCommand';
import {createGlobalSlashCommand} from '../../../../lib/discord.js/slashCommands/createGlobalSlashCommand';
import {sleep} from '../../../../utils/sleep';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';
import editMessage from '../../../../lib/discord.js/message/editMessage';

export default <PrefixCommand>{
  name: 'registerSlash',
  commands: ['slash register'],
  type: COMMAND_TYPE.dev,
  execute: async (client, message, args) => {
    const slashCommands = await listSlashCommands();

    const isGuild = message.content.includes('--guild');
    const isGlobal = message.content.includes('--global');
    const commandsToRegister = slashCommands.filter((sc) => args.includes(sc.name));
    if (!commandsToRegister.length)
      return sendMessage({
        client,
        channelId: message.channel.id,
        options: {
          content: 'No commands to register',
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
    let registered = 0;
    const sentMessage = await sendMessage({
      client,
      channelId: message.channel.id,
      options: {
        content: getStatusMessage(),
      },
    });

    if (!sentMessage) return;
    if (isGuild) {
      for (const command of commandsToRegister) {
        // ==== Register guild slash command ====
        await createGuildSlashCommand({
          client,
          guild: message.guild!,
          commands: command.builder.toJSON(),
        });
        registered++;
        // ==== Update status message ====
        await editMessage({
          client,
          message: sentMessage,
          options: {
            content: getStatusMessage(),
          },
        });
        // ==== Wait 1 second ====
        await sleep(1000);
      }
    } else if (isGlobal) {
      for (const command of commandsToRegister) {
        // ==== Register global slash command ====
        await createGlobalSlashCommand({
          client,
          commands: command.builder.toJSON(),
        });
        registered++;
        // ==== Update status message ====
        await editMessage({
          client,

          message: sentMessage,
          options: {
            content: getStatusMessage(),
          },
        });
        // ==== Wait 1 second ====
        await sleep(1000);
      }
    }

    function getStatusMessage() {
      return `Registering ${commandsToRegister.length} slash commands..., (${registered}/${commandsToRegister.length})`;
    }
  },
};
