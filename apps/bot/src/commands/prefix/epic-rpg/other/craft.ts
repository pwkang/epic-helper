import {rpgCraft} from '../../../../lib/epic-rpg/commands/other/craft';
import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgCraft',
  commands: ['craft ruby sword', 'craft ruby armor', 'craft coin sword'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: (client, message) => {
    rpgCraft({
      author: message.author,
      message,
      isSlashCommand: false,
      client,
    });
  },
};
