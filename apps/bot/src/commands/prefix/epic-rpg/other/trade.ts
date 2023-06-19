import {rpgTrade} from '../../../../lib/epic-rpg/commands/other/trade';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

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
