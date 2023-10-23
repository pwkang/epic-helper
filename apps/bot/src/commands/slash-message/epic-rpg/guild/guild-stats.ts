import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {rpgGuild} from '../../../../lib/epic-rpg/commands/guild/guild';

export default <SlashMessage>{
  name: 'rpgGuildStats',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['guild stats'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, message, author) => {
    rpgGuild({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
