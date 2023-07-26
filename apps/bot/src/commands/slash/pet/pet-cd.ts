import {ButtonStyle} from 'discord.js';
import {itemListingHelper} from '../../../utils/item-listing-helper';
import {paginatePetCd, PET_CD_PET_PAGE} from '../../../lib/epic-helper/features/pets/pet-cd';
import {userPetServices} from '../../../services/database/user-pet.service';
import {SLASH_COMMAND_PET_NAME} from './constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'cd',
  description: 'List of pets on adventure',
  type: 'subcommand',
  commandName: SLASH_COMMAND_PET_NAME,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, interaction) => {
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
  },
};