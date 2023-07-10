import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';
import {rpgProgress} from '../../../../lib/epic-rpg/commands/account/progress';

export default <SlashMessage>{
  name: 'rpgProgress',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['progress'],
  execute: async (client, message, author) => {
    if (!message.guild) return;
    rpgProgress({
      client,
      author,
      message,
      isSlashCommand: true,
      server: message.guild,
    });
  },
};
