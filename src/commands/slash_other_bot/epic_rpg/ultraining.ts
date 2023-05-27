import {OTHER_BOT_TYPE} from '../../../constants/bot';
import {rpgUltraining} from '../../../lib/epic_rpg/commands/progress/ultraining';

export default <SlashCommandOtherBot>{
  name: 'rpgTraining',
  bot: OTHER_BOT_TYPE.rpg,
  commandName: ['ultraining start'],
  execute: async (client, message, author) => {
    rpgUltraining({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
