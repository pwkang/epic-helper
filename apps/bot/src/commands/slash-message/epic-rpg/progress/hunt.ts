import {rpgHunt} from '../../../../lib/epic-rpg/commands/progress/hunt';
import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgHunt',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['hunt'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: async (client, message, author) => {
    rpgHunt({
      author,
      message,
      client,
      isSlashCommand: true
    });
  }
};
