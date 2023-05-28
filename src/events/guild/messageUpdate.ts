import {Client, Events, Message} from 'discord.js';
import {isRpgPet, rpgPet} from '../../lib/epic_rpg/pets/pet.lib';
import {redisGetRpgMessageOwner} from '../../services/redis/rpg-message-owner.redis';

export default <BotEvent>{
  eventName: Events.MessageUpdate,
  execute: async (client, oldMessage: Message, newMessage: Message) => {
    if (isBotSlashCommand(newMessage) && isFirstUpdateAfterDeferred(oldMessage)) {
      const commands = searchOtherBotSlashCommands(client, newMessage);
      if (!commands.size) return;
      commands.forEach((cmd) => cmd.execute(client, newMessage, newMessage.interaction?.user!));
    }

    const ownerId = await redisGetRpgMessageOwner({
      client,
      messageId: newMessage.id,
    });
    if (!ownerId) return;
    const owner = client.users.cache.get(ownerId);
    if (owner) {
      if (isRpgPet({author: owner, embed: newMessage.embeds[0]})) {
        rpgPet({
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

const searchOtherBotSlashCommands = (client: Client, message: Message) =>
  client.slashCommandsOtherBot.filter((cmd) =>
    cmd.commandName.some(
      (name) => name.toLowerCase() === message.interaction?.commandName?.toLowerCase()
    )
  );
