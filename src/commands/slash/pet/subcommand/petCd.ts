import {IPetSubcommand} from '../pet.type';
import {ButtonStyle, User} from 'discord.js';
import {
  generatePetListEmbed,
  PET_LIST_PET_PET_PAGE,
} from '../../../../lib/epic_helper/features/pets/petListEmbed.lib';
import {calcTotalPets, getUserPets} from '../../../../models/user-pet/user-pet.service';
import {itemListingHelper} from '../../../../lib/epic_helper/itemListingHelper';
import {
  paginatePetCd,
  PET_CD_PET_PAGE,
} from '../../../../lib/epic_helper/features/pets/petCdEmbed.lib';

export default async function petCd({client, interaction}: IPetSubcommand) {
  const totalPets = await calcTotalPets({
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
