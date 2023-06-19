import {IPetSubcommand} from '../pet.type';
import {ButtonStyle} from 'discord.js';
import {
  paginatePetList,
  PET_LIST_PET_PET_PAGE,
} from '../../../../lib/epic-helper/features/pets/pet-list';
import {itemListingHelper} from '../../../../utils/item-listing-helper';
import {userPetServices} from '@epic-helper/models';

export default async function petList({client, interaction}: IPetSubcommand) {
  const totalPets = await userPetServices.calcTotalPets({
    userId: interaction.user.id,
  });

  await itemListingHelper({
    channelId: interaction.channelId,
    client,
    embedFn: (page) =>
      paginatePetList({
        page,
        author: interaction.user,
      }),
    interaction,
    itemsPerPage: PET_LIST_PET_PET_PAGE,
    totalItems: totalPets,
  });
}
