import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgInventory} from '../../../../lib/epic_rpg/commands/account/inventory';

export default <SlashCommandOtherBot>{
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
