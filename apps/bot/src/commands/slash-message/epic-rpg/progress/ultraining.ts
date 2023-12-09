import {rpgUltraining} from '../../../../lib/epic-rpg/commands/progress/ultraining';
import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgUltraining',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['ultraining start'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgUltraining({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
