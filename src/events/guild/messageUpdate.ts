import {Events} from 'discord.js';
import {isRpgPet, rpgPet} from '../../lib/epic_rpg/pets/pet.lib';
import {redisGetRpgMessageOwner} from '../../services/redis/rpg-message-owner.redis';

export default <BotEvent>{
  eventName: Events.MessageUpdate,
  execute: async (client, oldMessage, newMessage) => {
    const ownerId = await redisGetRpgMessageOwner({
      client,
      messageId: newMessage.id,
    });
    if (!ownerId) return;
    const owner = client.users.cache.get(ownerId);
    if (!owner) return;
    if (
      isRpgPet({
        author: owner,
        embed: newMessage.embeds[0],
      })
    ) {
      rpgPet({
        embed: newMessage.embeds[0],
        author: owner,
      });
    }
  },
};
