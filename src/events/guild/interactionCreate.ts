import {Events, type Interaction} from 'discord.js';

export default <BotEvent>{
  eventName: Events.InteractionCreate,
  once: false,
  execute: async (client, interaction: Interaction) => {
    if (!interaction.guild || !interaction.isCommand()) return;
    
    const command = client.slashCommands.find(
      (cmd) => cmd.builder.name === interaction.commandName
    );

    if (!command) return;

    await command.execute(client, interaction);
  },
};
