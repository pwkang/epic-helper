import {rpgUltraining} from '../../../../lib/epic-rpg/commands/progress/ultraining';
import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgUltraining',
  commands: ['ultr', 'ultraining'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message) => {
    rpgUltraining({
      author: message.author,
      client,
      message,
      isSlashCommand: false,
    });
  },
};
