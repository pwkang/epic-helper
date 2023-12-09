import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {rpgProgress} from '../../../../lib/epic-rpg/commands/account/progress';

export default <SlashMessage>{
  name: 'rpgProgress',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['progress'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, message, author) => {
    if (!message.guild) return;
    rpgProgress({
      client,
      author,
      message,
      isSlashCommand: true,
      server: message.guild,
    });
  },
};
