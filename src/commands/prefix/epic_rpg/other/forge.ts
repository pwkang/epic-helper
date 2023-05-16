import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgForge, {isSuccessfullyForged} from '../../../../lib/epic_rpg/commands/other/forge';

export default <PrefixCommand>{
  name: 'rpgForge',
  commands: ['forge ultra-edgy sword'],
  type: COMMAND_TYPE.rpg,
  execute: (client, message) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('content', async (content) => {
      if (isSuccessfullyForged({content})) {
        await rpgForge({
          author: message.author,
          content,
        });
      }
    });
    event.on('embed', (embed) => {});
  },
};
