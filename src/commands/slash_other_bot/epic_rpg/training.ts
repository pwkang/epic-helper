import {OTHER_BOT_TYPE} from '../../../constants/bot';
import {rpgTraining} from '../../../lib/epic_rpg/commands/progress/training';

export default <SlashCommandOtherBot>{
  name: 'rpgTraining',
  bot: OTHER_BOT_TYPE.rpg,
  commandName: ['training'],
  execute: async (client, message, author) => {
    rpgTraining({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
