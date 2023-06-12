import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {rpgTrade} from '../../../../lib/epic_rpg/commands/other/trade';

export default <PrefixCommand>{
  name: 'rpgTrade',
  commands: ['trade e', 'trade f'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgTrade({
      author: message.author,
      client,
      message,
      isSlashCommand: false,
    });
  },
};
