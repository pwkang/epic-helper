import type {BaseInteraction, Client} from 'discord.js';
import {Events} from 'discord.js';
import {preCheckCommand} from '../../utils/command-precheck';
import commandHelper from '../../lib/epic-helper/command-helper';

export default <BotEvent>{
  eventName: Events.InteractionCreate,
  once: false,
  execute: async (client, interaction: BaseInteraction) => {
    if (!interaction.inGuild() || !interaction.guild) return;
    if (!client.readyAt) return;
    if (client.readyAt > interaction.createdAt) return;

    const isClusterActive = await commandHelper.cluster.isClusterActive(client);
    if (!isClusterActive) return;

    if (interaction.isChatInputCommand()) {
      const command = searchSlashCommand(client, interaction);

      if (!command) return;

      const toExecute = await preCheckCommand({
        client,
        preCheck: command.preCheck,
        author: interaction.user,
        server: interaction.guild,
        interaction,
      });
      if (!toExecute) return;

      await command.execute(client, interaction);
    }
  },
};

const searchSlashCommand = (client: Client, interaction: BaseInteraction) => {
  if (!interaction.isCommand() || !interaction.isChatInputCommand())
    return null;
  const commandName = interaction.commandName;
  const subcommandGroupName = interaction.options.getSubcommandGroup();
  const subcommandName = interaction.options.getSubcommand(false);
  const searchCommandName = [commandName, subcommandGroupName, subcommandName]
    .filter((name) => !!name)
    .join(' ');
  return client.slashCommands.get(searchCommandName);
};
