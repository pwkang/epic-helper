import {rpgBuyLootbox} from '../../../../lib/epic-rpg/commands/progress/lootbox';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

export default <SlashMessage>{
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
