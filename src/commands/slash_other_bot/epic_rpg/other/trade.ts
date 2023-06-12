import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgTrade} from '../../../../lib/epic_rpg/commands/other/trade';

export default <SlashCommandOtherBot>{
  name: 'rpgTrade',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['trade items'],
  execute: async (client, message, author) => {
    rpgTrade({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
