import {COMMAND_TYPE} from '../../constants/bot';
import rpgCraft, {isSuccessfullyCrafted} from '../../lib/epic_rpg/commands/other/craft';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: COMMAND_TYPE.dev,
  execute: async (client, message) => {
    const args = message.content.split(' ');
    if (!args[2]) return;
    const msg = await message.channel.messages.fetch(args[2]);
    if (isSuccessfullyCrafted({content: msg.content})) {
      rpgCraft({
        content: msg.content,
        author: message.author,
      });
    }
  },
};
