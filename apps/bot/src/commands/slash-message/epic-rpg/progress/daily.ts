import {rpgDaily} from '../../../../lib/epic-rpg/commands/progress/daily';
import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgDaily',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['daily'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgDaily({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
