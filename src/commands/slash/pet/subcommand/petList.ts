import {IPetSubcommand} from '../pet.type';
import replyInteraction from '../../../../lib/discord.js/interaction/replyInteraction';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, User} from 'discord.js';
import {generatePetListEmbed} from '../../../../lib/epic_helper/features/pets/petListEmbed.lib';
import {calcTotalPets, getUserPets} from '../../../../models/user-pet/user-pet.service';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';
import {sleep} from '../../../../utils/sleep';

const petPerPage = 21;

export default async function petList({client, interaction}: IPetSubcommand) {
  let page = 0;
  const totalPets = await calcTotalPets({
    userId: interaction.user.id,
  });
  const row = generateNavigationRow(page, totalPets);
  const embed = await generateEmbed(page, interaction.user);
  const event = await replyInteraction({
    client,
    interaction,
    options: {
      content: 'List',
      components: [row],
      embeds: [embed],
    },
    interactive: true,
  });
  if (!event) return;
  event.on('first', async (interaction) => {
    page = 0;
    const embed = await generateEmbed(page, interaction.user);
    const row = generateNavigationRow(page, totalPets);
    return {
      embeds: [embed],
      components: [row],
    };
  });
  event.on('prev', async (interaction) => {
    page--;
    const embed = await generateEmbed(page, interaction.user);
    const row = generateNavigationRow(page, totalPets);
    return {
      embeds: [embed],
      components: [row],
    };
  });
  event.on('next', async (interaction) => {
    page++;
    const embed = await generateEmbed(page, interaction.user);
    const row = generateNavigationRow(page, totalPets);
    return {
      embeds: [embed],
      components: [row],
    };
  });
  event.on('last', async (interaction) => {
    page = Math.floor(totalPets / petPerPage);
    const embed = await generateEmbed(page, interaction.user);
    const row = generateNavigationRow(page, totalPets);
    return {
      embeds: [embed],
      components: [row],
    };
  });
  event.on('all', async (collected) => {
    showAllPets({
      client,
      channelId: interaction.channelId,
      author: interaction.user,
      totalPets,
    });
    return {
      content: '‍',
      embeds: [],
      components: [],
    };
  });
}

interface IShowAllPets {
  client: Client;
  author: User;
  totalPets: number;
  channelId: string;
}

const showAllPets = async ({author, client, totalPets, channelId}: IShowAllPets) => {
  const totalPage = Math.floor(totalPets / petPerPage);
  for (let i = 0; i <= totalPage; i++) {
    const embed = await generateEmbed(i, author);
    await sendMessage({
      client,
      channelId,
      options: {
        embeds: [embed],
      },
    });
    await sleep(1500);
  }
};

const generateEmbed = async (page: number, author: User) => {
  const pets = await getUserPets({page, limit: petPerPage, userId: author.id});

  return generatePetListEmbed({
    pets,
    author,
  });
};

const generateNavigationRow = (page: number, totalPets: number) => {
  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('first')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⏪')
      .setDisabled(page === 0)
  );
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('prev')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⬅️')
      .setDisabled(page === 0)
  );
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('next')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('➡️')
      .setDisabled(page === Math.floor(totalPets / petPerPage))
  );
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('last')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⏩')
      .setDisabled(page === Math.floor(totalPets / petPerPage))
  );
  row.addComponents(
    new ButtonBuilder().setCustomId('all').setStyle(ButtonStyle.Primary).setLabel('All')
  );
  return row;
};
