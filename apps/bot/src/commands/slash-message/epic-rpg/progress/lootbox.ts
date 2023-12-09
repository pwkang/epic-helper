import {rpgBuyLootbox} from '../../../../lib/epic-rpg/commands/progress/lootbox';
import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgBuyLootbox',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['buy'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgBuyLootbox({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
