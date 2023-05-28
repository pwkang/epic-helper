import {OTHER_BOT_TYPE} from '../../../../constants/bot';
import {rpgCraft} from '../../../../lib/epic_rpg/commands/other/craft';
import {rpgOpenLootbox} from '../../../../lib/epic_rpg/commands/other/open';
import {rpgTrade} from '../../../../lib/epic_rpg/commands/other/trade';

export default <SlashCommandOtherBot>{
  name: 'rpgTrade',
  bot: OTHER_BOT_TYPE.rpg,
  commandName: ['trade items'],
  execute: async (client, message, author) => {
    rpgTrade({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
