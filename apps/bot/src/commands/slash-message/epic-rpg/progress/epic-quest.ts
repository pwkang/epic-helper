import {rpgEpicQuest} from '../../../../lib/epic-rpg/commands/progress/epic-quest';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgEpicQuest',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
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
