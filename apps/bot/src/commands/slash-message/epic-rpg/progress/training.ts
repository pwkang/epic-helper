import {rpgTraining} from '../../../../lib/epic-rpg/commands/progress/training';
import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgTraining',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['training'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgTraining({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
