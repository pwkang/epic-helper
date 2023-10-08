import {rpgForge} from '../../../../lib/epic-rpg/commands/other/forge';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgForge',
  commands: ['forge ultra-edgy sword'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: (client, message) => {
    rpgForge({
      author: message.author,
      client,
      message,
      isSlashCommand: false
    });
  }
};
