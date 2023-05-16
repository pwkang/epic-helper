import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgTrade, {
  isNotEnoughItems,
  isRpgTrade,
} from '../../../../lib/epic_rpg/commands/other/trade';

export default <PrefixCommand>{
  name: 'rpgTrade',
  commands: ['trade e', 'trade f'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      author: message.author,
      channelId: message.channelId,
      client,
    });
    if (!event) return;
    event.on('embed', (embed) => {
      if (isRpgTrade({embed, author: message.author})) {
        rpgTrade({embed, author: message.author});
        event.stop();
      }
    });
    event.on('content', (content, collected) => {
      if (isNotEnoughItems({message: collected, author: message.author})) {
        event.stop();
      }
    });
  },
};
