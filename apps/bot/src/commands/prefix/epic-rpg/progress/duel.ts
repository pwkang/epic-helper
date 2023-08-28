import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {rpgDuel} from '../../../../lib/epic-rpg/commands/progress/duel';

export default <PrefixCommand>{
  name: 'rpgDuel',
  commands: ['duel'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message) => {
    rpgDuel({
      client,
      author: message.author,
      message,
      isSlashCommand: false,
      targetUser: message.mentions.users.first(),
    });
  },
};
