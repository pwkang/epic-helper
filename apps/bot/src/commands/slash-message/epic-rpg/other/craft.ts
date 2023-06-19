import {rpgCraft} from '../../../../lib/epic-rpg/commands/other/craft';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgCraft',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['craft'],
  execute: async (client, message, author) => {
    rpgCraft({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
