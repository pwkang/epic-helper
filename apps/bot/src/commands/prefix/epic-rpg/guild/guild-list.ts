import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {rpgGuildList} from '../../../../lib/epic-rpg/commands/guild/guild-list';

export default <PrefixCommand>{
  name: 'guildList',
  commands: ['guild list'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: (client, message) => {
    rpgGuildList({
      author: message.author,
      message,
      isSlashCommand: false,
      client,
    });
  },
};
