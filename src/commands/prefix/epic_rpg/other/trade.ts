import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import {
  extractTradedItems,
  isNotEnoughItems,
  isRpgTrade,
} from '../../../../lib/epic_rpg/commands/other/trade';
import {updateUserRubyAmount} from '../../../../models/user/user.service';

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
        event.stop();
        const traded = extractTradedItems({embed, author: message.author});
        if (!traded.ruby) return;
        updateUserRubyAmount({
          userId: message.author.id,
          ruby: Math.abs(traded.ruby),
          type: traded.ruby > 0 ? 'inc' : 'dec',
        });
      }
    });
    event.on('content', (content, collected) => {
      if (isNotEnoughItems({message: collected, author: message.author})) {
        event.stop();
      }
    });
  },
};
