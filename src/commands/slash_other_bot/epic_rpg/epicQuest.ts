import {OTHER_BOT_TYPE} from '../../../constants/bot';
import {rpgEpicQuest} from '../../../lib/epic_rpg/commands/progress/epicQuest';

export default <SlashCommandOtherBot>{
  name: 'rpgEpicQuest',
  bot: OTHER_BOT_TYPE.rpg,
  commandName: ['epic quest'],
  execute: async (client, message, author) => {
    rpgEpicQuest({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};