import {IPetSubcommand} from '../pet.type';
import replyInteraction from '../../../../lib/discord.js/interaction/replyInteraction';
import {ButtonStyle, Client, User} from 'discord.js';
import {
  generatePetListEmbed,
  PET_LIST_PET_PET_PAGE,
} from '../../../../lib/epic_helper/features/pets/petListEmbed.lib';
import {calcTotalPets, getUserPets} from '../../../../models/user-pet/user-pet.service';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';
import {sleep} from '../../../../utils/sleep';
import {generateNavigationRow} from '../../../../utils/paginationRow';

export default async function petList({client, interaction}: IPetSubcommand) {
  let page = 0;
  const totalPets = await calcTotalPets({
    userId: interaction.user.id,
  });
  const row = generateNavigationRow({
    page,
    itemPerPage: PET_LIST_PET_PET_PAGE,
    all: true,
    total: totalPets,
  });
  const embed = await generateEmbed(page, interaction.user);
  const event = await replyInteraction({
    client,
    interaction,
    options: {
      components: [row],
      embeds: [embed],
    },
    interactive: true,
  });
  if (!event) return;
  event.on('first', async (interaction) => {
    page = 0;
    return await updatePage(page, totalPets, interaction.user, event);
  });
  event.on('prev', async (interaction) => {
    page--;
    return await updatePage(page, totalPets, interaction.user, event);
  });
  event.on('next', async (interaction) => {
    page++;
    return await updatePage(page, totalPets, interaction.user, event);
  });
  event.on('last', async (interaction) => {
    page = Math.floor(totalPets / PET_LIST_PET_PET_PAGE);
    return await updatePage(page, totalPets, interaction.user, event);
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
  const totalPage = Math.floor(totalPets / PET_LIST_PET_PET_PAGE);
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
  const pets = await getUserPets({page, limit: PET_LIST_PET_PET_PAGE, userId: author.id});

  return generatePetListEmbed({
    pets,
    author,
  });
};

const updatePage = async (page: number, totalPets: number, author: User, event: any) => {
  const embed = await generateEmbed(page, author);
  const row = generateNavigationRow({
    page,
    itemPerPage: PET_LIST_PET_PET_PAGE,
    all: true,
    total: totalPets,
  });
  return {
    embeds: [embed],
    components: [row],
  };
};
