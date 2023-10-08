import {rpgQuest} from '../../../../lib/epic-rpg/commands/progress/quest';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgQuest',
  commands: ['quest'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: async (client, message) => {
    rpgQuest({
      author: message.author,
      client,
      message,
      isSlashCommand: false
    });
  }
};
