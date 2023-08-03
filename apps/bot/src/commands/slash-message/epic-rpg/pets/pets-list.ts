import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {rpgPetList} from '../../../../lib/epic-rpg/commands/pets/pet-list';

export default <SlashMessage>{
  name: 'petsList',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['pets list'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    await rpgPetList({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
