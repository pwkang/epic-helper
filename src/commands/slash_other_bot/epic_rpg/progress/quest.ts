import {OTHER_BOT_TYPE} from '../../../../constants/bot';
import {rpgQuest} from '../../../../lib/epic_rpg/commands/progress/quest';

export default <SlashCommandOtherBot>{
  name: 'rpgQuest',
  bot: OTHER_BOT_TYPE.rpg,
  commandName: ['quest start'],
  execute: async (client, message, author) => {
    rpgQuest({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
