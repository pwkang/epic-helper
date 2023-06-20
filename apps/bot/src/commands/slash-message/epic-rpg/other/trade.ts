import {rpgTrade} from '../../../../lib/epic-rpg/commands/other/trade';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

export default <SlashMessage>{
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
