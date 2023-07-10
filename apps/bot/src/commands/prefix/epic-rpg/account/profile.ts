import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {rpgProfile} from '../../../../lib/epic-rpg/commands/account/profile';

export default <PrefixCommand>{
  name: 'profile',
  commands: ['profile', 'p'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: (client, message) => {
    if (!message.guild) return;
    rpgProfile({
      author: message.author,
      isSlashCommand: false,
      message,
      client,
      server: message.guild,
    });
  },
};
