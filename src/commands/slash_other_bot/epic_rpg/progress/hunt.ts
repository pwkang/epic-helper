import {OTHER_BOT_TYPE} from '../../../../constants/bot';
import {rpgHunt} from '../../../../lib/epic_rpg/commands/progress/hunt';

export default <SlashCommandOtherBot>{
  name: 'rpgHunt',
  bot: OTHER_BOT_TYPE.rpg,
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
