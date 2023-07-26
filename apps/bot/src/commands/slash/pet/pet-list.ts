import {ButtonStyle} from 'discord.js';
import {
  paginatePetList,
  PET_LIST_PET_PET_PAGE,
} from '../../../lib/epic-helper/features/pets/pet-list';
import {itemListingHelper} from '../../../utils/item-listing-helper';
import {userPetServices} from '../../../services/database/user-pet.service';
import {SLASH_COMMAND_PET_NAME} from './constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'list',
  description: 'List all your pets',
  type: 'subcommand',
  commandName: SLASH_COMMAND_PET_NAME,
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
