import {rpgEnchant} from '../../../../lib/epic-rpg/commands/other/enchant';
import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgEnchant',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['enchant', 'refine', 'transmute', 'transcend'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgEnchant({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
