import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgOpenLootbox} from '../../../../lib/epic_rpg/commands/other/open';

export default <SlashCommandOtherBot>{
  name: 'rpgOpenLootbox',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['open'],
  execute: async (client, message, author) => {
    rpgOpenLootbox({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
