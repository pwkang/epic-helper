import {OTHER_BOT_TYPE} from '../../../../constants/bot';
import {rpgCraft} from '../../../../lib/epic_rpg/commands/other/craft';

export default <SlashCommandOtherBot>{
  name: 'rpgCraft',
  bot: OTHER_BOT_TYPE.rpg,
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
