import {rpgOpenLootbox} from '../../../../lib/epic-rpg/commands/other/open';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgOpen',
  commands: ['open'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: async (client, message) => {
    rpgOpenLootbox({
      author: message.author,
      client,
      message,
      isSlashCommand: false
    });
  }
};
