import {rpgTrade} from '../../../../lib/epic-rpg/commands/other/trade';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgTrade',
  commands: ['trade e', 'trade f'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message) => {
    rpgTrade({
      author: message.author,
      client,
      message,
      isSlashCommand: false,
    });
  },
};
