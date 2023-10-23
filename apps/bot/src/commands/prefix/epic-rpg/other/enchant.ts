import {rpgEnchant} from '../../../../lib/epic-rpg/commands/other/enchant';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgEnchant',
  commands: ['enchant', 'refine', 'transmute', 'transcend'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: (client, message) => {
    rpgEnchant({
      client,
      author: message.author,
      message,
      isSlashCommand: false,
    });
  },
};
