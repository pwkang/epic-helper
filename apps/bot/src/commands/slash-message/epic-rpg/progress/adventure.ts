import {rpgAdventure} from '../../../../lib/epic-rpg/commands/progress/adventure';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgAdventure',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['adventure'],
  execute: async (client, message, author) => {
    rpgAdventure({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
