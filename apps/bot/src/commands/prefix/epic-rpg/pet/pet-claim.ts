import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import {rpgPetClaim} from '../../../../lib/epic-rpg/commands/pets/pet-claim';

export default <PrefixCommand>{
  name: 'petClaim',
  commands: ['pet claim', 'pets claim'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: async (client, message) => {
    await rpgPetClaim({
      client,
      author: message.author,
      message,
      isSlashCommand: false
    });
  }
};
