import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';
import {rpgGuild} from '../../../../lib/epic-rpg/commands/guild/guild';

export default <SlashMessage>{
  name: 'rpgGuildStats',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['guild stats'],
  execute: async (client, message, author) => {
    rpgGuild({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
