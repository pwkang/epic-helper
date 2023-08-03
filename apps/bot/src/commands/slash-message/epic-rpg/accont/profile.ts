import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {rpgProfile} from '../../../../lib/epic-rpg/commands/account/profile';

export default <SlashMessage>{
  name: 'rpgProfile',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['profile'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, message, author) => {
    if (!message.guild) return;
    rpgProfile({
      client,
      author,
      message,
      isSlashCommand: true,
      server: message.guild,
    });
  },
};
