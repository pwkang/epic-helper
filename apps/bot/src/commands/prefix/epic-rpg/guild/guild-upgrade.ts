import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import {rpgGuildUpgrade} from '../../../../lib/epic-rpg/commands/guild/guild-upgrade';

export default <PrefixCommand>{
  name: 'guildUpgrade',
  commands: ['guild upgrade'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip
  },
  execute: (client, message) => {
    rpgGuildUpgrade({
      author: message.author,
      message,
      isSlashCommand: false,
      client
    });
  }
};
