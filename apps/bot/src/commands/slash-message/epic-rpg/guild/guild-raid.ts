import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {rpgGuildRaid} from '../../../../lib/epic-rpg/commands/guild/guild-raid';

export default <SlashMessage>{
  name: 'rpgGuildRaid',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['guild raid'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, message, author) => {
    rpgGuildRaid({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
