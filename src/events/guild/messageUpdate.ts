import {Client, Events, Message} from 'discord.js';
import {rpgPetList, rpgPetListChecker} from '../../lib/epic_rpg/commands/pets/petList.lib';
import redisRpgMessageOwner from '../../services/redis/rpg-message-owner.redis';

export default <BotEvent>{
  eventName: Events.MessageUpdate,
  execute: async (client, oldMessage: Message, newMessage: Message) => {
    if (isBotSlashCommand(newMessage) && isFirstUpdateAfterDeferred(oldMessage)) {
      const messages = searchSlashMessages(client, newMessage);
      if (!messages.size) return;
      messages.forEach((cmd) => cmd.execute(client, newMessage, newMessage.interaction?.user!));
    }

    const ownerId = await redisRpgMessageOwner.getOwner({
      client,
      messageId: newMessage.id,
    });
    if (!ownerId) return;
    const owner = client.users.cache.get(ownerId);
    if (owner) {
      if (rpgPetListChecker.isRpgPet({author: owner, embed: newMessage.embeds[0]})) {
        rpgPetList({
          embed: newMessage.embeds[0],
          author: owner,
        });
      }
    }
  },
};

const isBotSlashCommand = (message: Message) => message.interaction && message.author.bot;

const isFirstUpdateAfterDeferred = (oldMessage: Message) =>
  oldMessage.content === '' && oldMessage.embeds.length === 0;

const searchSlashMessages = (client: Client, message: Message) =>
  client.slashMessages.filter((cmd) =>
    cmd.commandName.some(
      (name) => name.toLowerCase() === message.interaction?.commandName?.toLowerCase()
    )
  );
