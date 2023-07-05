import {rpgTraining} from '../../../../lib/epic-rpg/commands/progress/training';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgTraining',
  commands: ['training', 'tr'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message) => {
    rpgTraining({
      author: message.author,
      client,
      isSlashCommand: false,
      message,
    });
  },
};
