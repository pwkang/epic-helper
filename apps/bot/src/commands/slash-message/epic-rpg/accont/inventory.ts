import {rpgInventory} from '../../../../lib/epic-rpg/commands/account/inventory';
import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgInventory',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['inventory'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgInventory({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
