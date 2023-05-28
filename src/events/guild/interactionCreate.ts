import {BaseInteraction, Client, Events} from 'discord.js';

export default <BotEvent>{
  eventName: Events.InteractionCreate,
  once: false,
  execute: async (client, interaction: BaseInteraction) => {
    if (!interaction.guild) return;

    const command = searchSlashCommand(client, interaction);

    if (!command) return;

    await command.execute(client, interaction as typeof command.interactionType);
  },
};

const searchSlashCommand = (client: Client, interaction: BaseInteraction) =>
  client.slashCommands.find(
    (cmd) => interaction.isCommand() && cmd.builder.name === interaction.commandName
  );
