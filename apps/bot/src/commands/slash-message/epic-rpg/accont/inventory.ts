import {rpgInventory} from '../../../../lib/epic-rpg/commands/account/inventory';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgInventory',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['inventory'],
  execute: async (client, message, author) => {
    rpgInventory({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
