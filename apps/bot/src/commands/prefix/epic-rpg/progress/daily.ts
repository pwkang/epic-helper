import {rpgDaily} from '../../../../lib/epic-rpg/commands/progress/daily';
import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgDaily',
  commands: ['daily'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message) => {
    rpgDaily({
      author: message.author,
      message,
      client,
      isSlashCommand: false,
    });
  },
};
