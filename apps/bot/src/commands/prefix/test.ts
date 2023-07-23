import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import embedReaders from '../../lib/epic-rpg/embed-readers';
import {generatePetCatchMessageOptions} from '../../lib/epic-rpg/utils/pet-catch-cmd';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const msg = await message.channel.messages.fetch(args[1]);
    const info = embedReaders.wildPet({
      embed: msg.embeds[0],
    });
    const result = generatePetCatchMessageOptions({info});
    console.log(result);
    await message.channel.send(result);
  },
};
