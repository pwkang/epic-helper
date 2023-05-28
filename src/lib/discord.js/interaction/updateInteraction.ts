import {Client, InteractionUpdateOptions, MessageComponentInteraction} from 'discord.js';

interface IUpdateInteraction {
  client: Client;
  interaction: MessageComponentInteraction;
  options: InteractionUpdateOptions;
}

export default function updateInteraction({interaction, client, options}: IUpdateInteraction) {
  interaction.update(options).catch(console.error);
}
