import {OTHER_BOT_TYPE} from '../../../../constants/bot';
import {rpgCraft} from '../../../../lib/epic_rpg/commands/other/craft';
import {rpgOpenLootbox} from '../../../../lib/epic_rpg/commands/other/open';

export default <SlashCommandOtherBot>{
  name: 'rpgOpenLootbox',
  bot: OTHER_BOT_TYPE.rpg,
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
