import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {rpgPetList, rpgPetListChecker} from '../../../../lib/epic-rpg/commands/pets/pet-list';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {redisRpgMessageOwner} from '../../../../services/redis/rpg-message-owner.redis';

export default <PrefixCommand>{
  name: 'petList',
  commands: ['pets', 'pet'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: (client, message) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('embed', async (embed, collected) => {
      if (rpgPetListChecker.isRpgPet({embed, author: message.author})) {
        event.stop();
        await redisRpgMessageOwner.setOwner({
          client,
          messageId: collected.id,
          userId: message.author.id,
        });
        await rpgPetList({
          embed,
          author: message.author,
        });
      }
    });
  },
};
