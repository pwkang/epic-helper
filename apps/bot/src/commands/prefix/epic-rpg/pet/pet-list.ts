import {rpgPetList} from '../../../../lib/epic-rpg/commands/pets/pet-list';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'petList',
  commands: ['pets', 'pet'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message) => {
    await rpgPetList({
      message,
      author: message.author,
      isSlashCommand: false,
      client,
    });
  },
};
