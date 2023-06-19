import {paginatePetCd, PET_CD_PET_PAGE} from '../../../../../lib/epic-helper/features/pets/pet-cd';
import {itemListingHelper} from '../../../../../utils/item-listing-helper';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {userPetServices} from '@epic-helper/models';

export default <PrefixCommand>{
  name: 'petCd',
  commands: ['petCd'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const totalPets = await userPetServices.calcTotalPets({
      userId: message.author.id,
      status: ['adventure', 'back'],
    });

    await itemListingHelper({
      channelId: message.channel.id,
      embedFn: (page) =>
        paginatePetCd({
          page,
          user: message.author,
        }),
      client,
      itemsPerPage: PET_CD_PET_PAGE,
      message,
      totalItems: totalPets,
    });
  },
};
