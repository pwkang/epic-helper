import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgAdventure} from '../../../../lib/epic-rpg/commands/progress/adventure';

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
