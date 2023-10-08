import {rpgInventory} from '../../../../lib/epic-rpg/commands/account/inventory';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgInventory',
  commands: ['inventory', 'inv', 'i'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: async (client, message, args) => {
    rpgInventory({
      args,
      author: message.author,
      message,
      client,
      isSlashCommand: false
    });
  }
};
