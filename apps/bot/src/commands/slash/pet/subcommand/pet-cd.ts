import {IPetSubcommand} from '../pet.type';
import {ButtonStyle} from 'discord.js';
import {itemListingHelper} from '../../../../utils/item-listing-helper';
import {paginatePetCd, PET_CD_PET_PAGE} from '../../../../lib/epic-helper/features/pets/pet-cd';
import {userPetServices} from '../../../../services/database/user-pet.service';

export default async function petCd({client, interaction}: IPetSubcommand) {
  const totalPets = await userPetServices.calcTotalPets({
    userId: interaction.user.id,
    status: ['adventure', 'back'],
  });

  await itemListingHelper({
    channelId: interaction.channelId,
    client,
    embedFn: (page) =>
      paginatePetCd({
        page,
        user: interaction.user,
      }),
    interaction,
    itemsPerPage: PET_CD_PET_PAGE,
    totalItems: totalPets,
  });
}
