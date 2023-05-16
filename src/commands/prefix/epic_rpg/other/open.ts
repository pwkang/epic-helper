import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import scanLootbox from '../../../../utils/epic_rpg/scanLootbox';
import rpgOpenLootbox, {isLootboxOpen} from '../../../../lib/epic_rpg/commands/other/open';

export default <PrefixCommand>{
  name: 'rpgOpen',
  commands: ['open'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      author: message.author,
      client,
      channelId: message.channelId,
    });
    if (!event) return;
    event.on('embed', (embed) => {
      if (isLootboxOpen({embed, author: message.author})) {
        rpgOpenLootbox({embed, author: message.author});
        event.stop();
      }
    });
  },
};
