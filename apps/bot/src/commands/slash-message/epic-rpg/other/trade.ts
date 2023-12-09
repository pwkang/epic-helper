import {rpgTrade} from '../../../../lib/epic-rpg/commands/other/trade';
import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgTrade',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['trade items'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgTrade({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
