import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgBuyLootbox} from '../../../../lib/epic_rpg/commands/progress/lootbox';

export default <SlashCommandOtherBot>{
  name: 'rpgBuyLootbox',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['buy'],
  execute: async (client, message, author) => {
    rpgBuyLootbox({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
