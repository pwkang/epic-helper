import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgCraft, {isSuccessfullyCrafted} from '../../../../lib/epic_rpg/commands/other/craft';

export default <PrefixCommand>{
  name: 'rpgCraft',
  commands: ['craft ruby sword', 'craft ruby armor', 'craft coin sword'],
  type: COMMAND_TYPE.rpg,
  execute: (client, message) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('content', async (content) => {
      if (isSuccessfullyCrafted({content})) {
        await rpgCraft({
          author: message.author,
          content,
        });
      }
    });
    event.on('embed', (embed) => {});
  },
};
