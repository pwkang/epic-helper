import {IPetSubcommand} from '../pet.type';
import {ButtonStyle} from 'discord.js';
import {
  paginatePetList,
  PET_LIST_PET_PET_PAGE,
} from '../../../../lib/epic_helper/features/pets/petListEmbed.lib';
import {calcTotalPets} from '../../../../models/user-pet/user-pet.service';
import {itemListingHelper} from '../../../../lib/epic_helper/itemListingHelper';

export default async function petList({client, interaction}: IPetSubcommand) {
  const totalPets = await calcTotalPets({
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
