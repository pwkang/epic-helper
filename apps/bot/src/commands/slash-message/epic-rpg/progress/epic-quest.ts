import {rpgEpicQuest} from '../../../../lib/epic-rpg/commands/progress/epic-quest';
import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgEpicQuest',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['epic quest'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: async (client, message, author) => {
    rpgEpicQuest({
      author,
      message,
      client,
      isSlashCommand: true
    });
  }
};
