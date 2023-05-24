import {IPetSubcommand} from '../pet.type';
import replyInteraction from '../../../../lib/discord.js/interaction/replyInteraction';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';

const petPerPage = 21;

export default async function petList({client, interaction}: IPetSubcommand) {
  let page = 0;
  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('petList')
      .setLabel('List')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('📜')
  );

  const event = await replyInteraction({
    client,
    interaction,
    options: {
      content: 'List',
      components: [row],
    },
    interactive: true,
  });
  event?.on('petList', async (interaction) => {
    return {
      content: 'Updated',
    };
  });
}
