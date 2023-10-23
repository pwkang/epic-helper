import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {rpgPetAdventure} from '../../../../lib/epic-rpg/commands/pets/pet-adventure';

export default <SlashMessage>{
  name: 'petsAdventure',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['pets adventure'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgPetAdventure({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
