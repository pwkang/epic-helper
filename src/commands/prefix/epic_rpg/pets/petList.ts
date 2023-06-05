import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import {COMMAND_TYPE} from '../../../../constants/bot';
import {isRpgPet, rpgPet} from '../../../../lib/epic_rpg/pets/pet.lib';
import {redisSetRpgMessageOwner} from '../../../../services/redis/rpg-message-owner.redis';

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
    event.on('embed', async (embed, collected) => {
      if (isRpgPet({embed, author: message.author})) {
        event.stop();
        await redisSetRpgMessageOwner({
          client,
          messageId: collected.id,
          userId: message.author.id,
        });
        await rpgPet({
          embed,
          author: message.author,
        });
      }
    });
  },
};
