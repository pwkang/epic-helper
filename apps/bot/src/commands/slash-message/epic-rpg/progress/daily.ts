import {rpgDaily} from '../../../../lib/epic-rpg/commands/progress/daily';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

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
