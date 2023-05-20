import {COMMAND_TYPE} from '../../constants/bot';
import rpgCraft, {isSuccessfullyCrafted} from '../../lib/epic_rpg/commands/other/craft';
import {getCalcSTTMessage} from '../../lib/epic_helper/features/calculator/calcSTT';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: COMMAND_TYPE.dev,
  execute: async (client, message) => {
    const args = message.content.split(' ');
    if (!args[2]) return;
    const msg = await message.channel.messages.fetch(args[2]);
    if (!msg) return;
    getCalcSTTMessage({
      embed: msg.embeds[0],
      area: 15,
      level: 5126,
      author: message.author,
    });
  },
};
