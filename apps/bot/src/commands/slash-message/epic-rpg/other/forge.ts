import {rpgForge} from '../../../../lib/epic-rpg/commands/other/forge';
import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgForge',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['forge'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgForge({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
