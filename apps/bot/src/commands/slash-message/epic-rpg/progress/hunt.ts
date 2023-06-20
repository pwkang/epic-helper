import {rpgHunt} from '../../../../lib/epic-rpg/commands/progress/hunt';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

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
