import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';
import {rpgProfile} from '../../../../lib/epic-rpg/commands/account/profile';

export default <SlashMessage>{
  name: 'rpgProfile',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['profile'],
  execute: async (client, message, author) => {
    if (!message.guild) return;
    rpgProfile({
      client,
      author,
      message,
      isSlashCommand: true,
      server: message.guild,
    });
  },
};
