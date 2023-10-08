import {rpgEpicQuest} from '../../../../lib/epic-rpg/commands/progress/epic-quest';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgEpicQuest',
  commands: ['epic quest'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: (client, message) => {
    rpgEpicQuest({
      author: message.author,
      client,
      isSlashCommand: false,
      message
    });
  }
};
