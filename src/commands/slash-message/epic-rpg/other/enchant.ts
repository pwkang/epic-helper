import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgEnchant} from '../../../../lib/epic-rpg/commands/other/enchant';

export default <SlashMessage>{
  name: 'rpgEnchant',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
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
