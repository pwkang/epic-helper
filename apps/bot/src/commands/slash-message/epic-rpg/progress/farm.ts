import {rpgFarm} from '../../../../lib/epic-rpg/commands/progress/farm';
import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgFarm',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['farm'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort
  },
  execute: async (client, message, author) => {
    rpgFarm({
      author,
      message,
      client,
      isSlashCommand: true
    });
  }
};
