import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';
import {rpgGuildRaid} from '../../../../lib/epic-rpg/commands/guild/guild-raid';

export default <SlashMessage>{
  name: 'rpgGuildRaid',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['guild raid'],
  execute: async (client, message, author) => {
    rpgGuildRaid({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
