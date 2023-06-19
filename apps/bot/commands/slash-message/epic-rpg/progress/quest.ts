import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgQuest} from '../../../../lib/epic-rpg/commands/progress/quest';

export default <SlashMessage>{
  name: 'rpgQuest',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
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
