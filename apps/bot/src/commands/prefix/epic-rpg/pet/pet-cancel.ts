import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {rpgPetCancel} from '../../../../lib/epic-rpg/commands/pets/pet-cancel';

const args1 = ['pets', 'pet'];
const args2 = ['adventure', 'adv'];
const args3 = ['cancel'];

function generateAllPossibleCommands(args1: string[], args2: string[], args3: string[]) {
  return args1.flatMap((arg1) =>
    args2.flatMap((arg2) => args3.map((arg3) => `${arg1} ${arg2} ${arg3}`))
  );
}

export default <PrefixCommand>{
  name: 'petCancel',
  commands: generateAllPossibleCommands(args1, args2, args3),
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: (client, message, args) => {
    rpgPetCancel({
      message,
      isSlashCommand: false,
      author: message.author,
      client,
      selectedPets: args.slice(3),
    });
  },
};
