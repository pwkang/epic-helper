import {
  paginatePetList,
  PET_LIST_PET_PET_PAGE,
} from '../../../lib/epic-helper/features/pets/pet-list';
import {itemListingHelper} from '../../../utils/item-listing-helper';
import {userPetServices} from '../../../services/database/user-pet.service';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.pet.list.name,
  description: SLASH_COMMAND.pet.list.description,
  commandName: SLASH_COMMAND.pet.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, interaction) => {
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
  },
};
