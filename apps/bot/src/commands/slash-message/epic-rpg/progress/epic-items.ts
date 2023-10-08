import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import {rpgUseEpicItem} from '../../../../lib/epic-rpg/commands/progress/epic-items';

export default <SlashMessage>{
  name: 'rpgUse',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['use'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: async (client, message, author) => {
    rpgUseEpicItem({
      author,
      message,
      client,
      isSlashCommand: true
    });
  }
};
