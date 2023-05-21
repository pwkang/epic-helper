import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import {COMMAND_TYPE} from '../../../../constants/bot';
import {isRpgPet, rpgPet} from '../../../../lib/epic_rpg/pets/pet.lib';

export default <PrefixCommand>{
  name: 'petList',
  commands: ['pets', 'pet'],
  type: COMMAND_TYPE.rpg,
  execute: (client, message) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('content', (content) => {});
    event.on('embed', async (embed, collected) => {
      if (isRpgPet({embed, author: message.author})) {
        event.stop();
        await rpgPet({
          embed,
          author: message.author,
        });
      }
    });
  },
};
