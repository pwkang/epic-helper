import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import embedReaders from '../../lib/epic-rpg/embed-readers';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const msg = await message.channel.messages.fetch(args[1]);
    console.log(embedReaders.guildUpgrade({embed: msg.embeds[0]}));
  },
};
