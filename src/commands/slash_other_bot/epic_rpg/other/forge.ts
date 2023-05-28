import {OTHER_BOT_TYPE} from '../../../../constants/bot';
import {rpgForge} from '../../../../lib/epic_rpg/commands/other/forge';

export default <SlashCommandOtherBot>{
  name: 'rpgForge',
  bot: OTHER_BOT_TYPE.rpg,
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
