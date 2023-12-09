import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {rpgGuildUpgrade} from '../../../../lib/epic-rpg/commands/guild/guild-upgrade';

export default <SlashMessage>{
  name: 'rpgGuildUpgrade',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['guild upgrade'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, message, author) => {
    rpgGuildUpgrade({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
