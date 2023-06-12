import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgForge} from '../../../../lib/epic_rpg/commands/other/forge';

export default <SlashMessage>{
  name: 'rpgForge',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['forge'],
  execute: async (client, message, author) => {
    rpgForge({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
