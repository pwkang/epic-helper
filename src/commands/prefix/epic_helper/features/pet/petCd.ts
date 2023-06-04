import {COMMAND_TYPE} from '../../../../../constants/bot';
import {calcTotalPets, getUserPets} from '../../../../../models/user-pet/user-pet.service';
import {User} from 'discord.js';
import {
  generatePetCdEmbed,
  PET_CD_PET_PAGE,
} from '../../../../../lib/epic_helper/features/pets/petCdEmbed.lib';
import {itemListingHelper} from '../../../../../lib/epic_helper/itemListingHelper';

export default <PrefixCommand>{
  name: 'petCd',
  commands: ['petCd'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const totalPets = await calcTotalPets({
      userId: message.author.id,
      status: ['adventure', 'back'],
    });
    await itemListingHelper({
      channelId: message.channel.id,
      embedFn: (page) => generateEmbed(page, message.author),
      client,
      itemsPerPage: PET_CD_PET_PAGE,
      message,
      totalItems: totalPets,
    });
  },
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
