import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgDaily} from '../../../../lib/epic_rpg/commands/progress/daily';

export default <SlashMessage>{
  name: 'rpgDaily',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['daily'],
  execute: async (client, message, author) => {
    rpgDaily({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
