import {COMMAND_TYPE} from '../../../../../constants/bot';
import {calcTotalPets, getUserPets} from '../../../../../models/user-pet/user-pet.service';
import {generateNavigationRow} from '../../../../../utils/paginationRow';
import sendInteractiveMessage from '../../../../../lib/discord.js/message/sendInteractiveMessage';
import {Client, User} from 'discord.js';
import {
  generatePetCdEmbed,
  PET_CD_PET_PAGE,
} from '../../../../../lib/epic_helper/features/pets/petCdEmbed.lib';
import sendMessage from '../../../../../lib/discord.js/message/sendMessage';
import {sleep} from '../../../../../utils/sleep';

export default <PrefixCommand>{
  name: 'petCd',
  commands: ['petCd'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    let page = 0;
    const totalPets = await calcTotalPets({
      userId: message.author.id,
      status: ['adventure', 'back'],
    });
    const row = generateNavigationRow({
      page,
      total: totalPets,
      all: true,
      itemPerPage: PET_CD_PET_PAGE,
    });
    const embed = await generateEmbed(page, message.author);
    const event = await sendInteractiveMessage({
      client,
      channelId: message.channel.id,
      options: {
        components: [row],
        embeds: [embed],
      },
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
      page = Math.floor(totalPets / PET_CD_PET_PAGE);
      return await updatePage(page, totalPets, interaction.user, event);
    });
    event.on('all', async (collected) => {
      showAllPets({
        client,
        channelId: message.channelId,
        author: message.author,
        totalPets,
      });
      return {
        content: '‍',
        embeds: [],
        components: [],
      };
    });
  },
};

interface IShowAllPets {
  client: Client;
  author: User;
  totalPets: number;
  channelId: string;
}

const showAllPets = async ({author, client, totalPets, channelId}: IShowAllPets) => {
  const totalPage = Math.floor(totalPets / PET_CD_PET_PAGE);
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

const generateEmbed = async (page: number, user: User) => {
  const pets = await getUserPets({
    page,
    limit: PET_CD_PET_PAGE,
    status: ['adventure', 'back'],
    userId: user.id,
    orderBy: 'petId',
  });
  return generatePetCdEmbed({
    pets,
    author: user,
  });
};

const updatePage = async (page: number, totalPets: number, author: User, event: any) => {
  const embed = await generateEmbed(page, author);
  const row = generateNavigationRow({
    page,
    itemPerPage: PET_CD_PET_PAGE,
    all: true,
    total: totalPets,
  });
  return {
    embeds: [embed],
    components: [row],
  };
};
