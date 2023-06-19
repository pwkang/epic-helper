import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgHunt} from '../../../../lib/epic-rpg/commands/progress/hunt';

export default <SlashMessage>{
  name: 'rpgHunt',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['hunt'],
  execute: async (client, message, author) => {
    rpgHunt({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
