import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';
import {rpgGuildUpgrade} from '../../../../lib/epic-rpg/commands/guild/guild-upgrade';

export default <SlashMessage>{
  name: 'rpgGuildUpgrade',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['guild upgrade'],
  execute: async (client, message, author) => {
    rpgGuildUpgrade({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
