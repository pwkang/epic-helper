import {rpgWeekly} from '../../../../lib/epic-rpg/commands/progress/weekly';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgWeekly',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
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
