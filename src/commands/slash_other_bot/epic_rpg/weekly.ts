import {OTHER_BOT_TYPE} from '../../../constants/bot';
import {rpgWeekly} from '../../../lib/epic_rpg/commands/progress/weekly';

export default <SlashCommandOtherBot>{
  name: 'rpgWeekly',
  bot: OTHER_BOT_TYPE.rpg,
  commandName: ['weekly'],
  execute: async (client, message, author) => {
    rpgWeekly({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
