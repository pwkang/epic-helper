import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {rpgPetClaim} from '../../../../lib/epic-rpg/commands/pets/pet-claim';

export default <SlashMessage>{
  name: 'petClaim',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['pets claim'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    await rpgPetClaim({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
