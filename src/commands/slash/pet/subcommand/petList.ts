import {IPetSubcommand} from '../pet.type';
import {ButtonStyle, User} from 'discord.js';
import {
  generatePetListEmbed,
  PET_LIST_PET_PET_PAGE,
} from '../../../../lib/epic_helper/features/pets/petListEmbed.lib';
import {calcTotalPets, getUserPets} from '../../../../models/user-pet/user-pet.service';
import {itemListingHelper} from '../../../../lib/epic_helper/itemListingHelper';

export default async function petList({client, interaction}: IPetSubcommand) {
  const totalPets = await calcTotalPets({
    userId: interaction.user.id,
  });

  await itemListingHelper({
    channelId: interaction.channelId,
    client,
    embedFn: (page) => generateEmbed(page, interaction.user),
    interaction,
    itemsPerPage: PET_LIST_PET_PET_PAGE,
    totalItems: totalPets,
  });
}

const generateEmbed = async (page: number, author: User) => {
  const pets = await getUserPets({page, limit: PET_LIST_PET_PET_PAGE, userId: author.id});

  return generatePetListEmbed({
    pets,
    author,
  });
};
