import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {rpgGuildList} from '../../../../lib/epic-rpg/commands/guild/guild-list';

export default <SlashMessage>{
  name: 'rpgGuildList',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['guild list'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, message, author) => {
    rpgGuildList({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
