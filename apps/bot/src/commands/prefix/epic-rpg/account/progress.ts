import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {rpgProgress} from '../../../../lib/epic-rpg/commands/account/progress';

export default <PrefixCommand>{
  name: 'rpgProgress',
  type: PREFIX_COMMAND_TYPE.rpg,
  commands: ['progress'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: (client, message) => {
    if (!message.guild) return;
    rpgProgress({
      client,
      author: message.author,
      server: message.guild,
      message,
      isSlashCommand: false,
    });
  },
};
