import {createRpgCommandListener} from '../../../../utils/createRpgCommandListener';
import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {isRpgPet, rpgPetList} from '../../../../lib/epic_rpg/commands/pets/petList.lib';
import {redisSetRpgMessageOwner} from '../../../../services/redis/rpg-message-owner.redis';

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
      if (isRpgPet({embed, author: message.author})) {
        event.stop();
        await redisSetRpgMessageOwner({
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
