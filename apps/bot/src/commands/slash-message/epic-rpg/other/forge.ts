import {rpgForge} from '../../../../lib/epic-rpg/commands/other/forge';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgForge',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['forge'],
  execute: async (client, message, author) => {
    rpgForge({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
