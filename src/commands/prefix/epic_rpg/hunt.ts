import {COMMAND_TYPE} from '../../../constants/bot';
import {createRpgCommandListener} from '../../../lib/epic_rpg/createRpgCommandListener';
import rpgHunt, {isRpgHuntSuccess} from '../../../lib/epic_rpg/commands/hunt';

export default <PrefixCommand>{
  name: 'rpgHunt',
  commands: ['hunt'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      client,
      channelId: message.channel.id,
      author: message.author,
    });
    if (!event) return;
    event.on('content', (content) => {
      if (isRpgHuntSuccess({author: message.author, content}))
        rpgHunt({
          client,
          channelId: message.channel.id,
          author: message.author,
          content,
        });
      event.stop();
    });
    event.on('embed', (embed) => {
      console.log(embed);
      event.stop();
    });
    event.on('cooldown', (cooldown) => {
      console.log(cooldown);
      event.stop();
    });
  },
};
