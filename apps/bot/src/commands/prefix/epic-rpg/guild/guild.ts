import {PREFIX_COMMAND_TYPE, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {rpgGuild} from '../../../../lib/epic-rpg/commands/guild/guild';

export default <PrefixCommand>{
  name: 'guild',
  commands: ['guild'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: (client, message) => {
    rpgGuild({
      author: message.author,
      message,
      isSlashCommand: false,
      client,
    });
  },
};
