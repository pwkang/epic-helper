import {OTHER_BOT_TYPE} from '../../../../constants/bot';
import {rpgEnchant} from '../../../../lib/epic_rpg/commands/other/enchant.lib';

export default <SlashCommandOtherBot>{
  name: 'rpgEnchant',
  bot: OTHER_BOT_TYPE.rpg,
  commandName: ['enchant', 'refine', 'transmute', 'transcend'],
  execute: async (client, message, author) => {
    rpgEnchant({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
