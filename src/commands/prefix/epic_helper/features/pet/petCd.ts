import {PREFIX_COMMAND_TYPE} from '../../../../../constants/bot';
import {calcTotalPets} from '../../../../../models/user-pet/user-pet.service';
import {
  paginatePetCd,
  PET_CD_PET_PAGE,
} from '../../../../../lib/epic_helper/features/pets/petCd.lib';
import {itemListingHelper} from '../../../../../utils/itemListingHelper';

export default <PrefixCommand>{
  name: 'petCd',
  commands: ['petCd'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const totalPets = await calcTotalPets({
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
