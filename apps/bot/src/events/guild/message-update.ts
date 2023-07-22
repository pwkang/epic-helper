import {Client, Events, Message, User} from 'discord.js';
import {rpgPetList, rpgPetListChecker} from '../../lib/epic-rpg/commands/pets/pet-list';
import {redisRpgMessageOwner} from '../../services/redis/rpg-message-owner.redis';
import {userService} from '../../services/database/user.service';
import {emitMessageEdited} from '../../utils/message-edited-listener';

export default <BotEvent>{
  eventName: Events.MessageUpdate,
  execute: async (client, oldMessage: Message, newMessage: Message) => {
    if (isBotSlashCommand(newMessage) && isFirstUpdateAfterDeferred(oldMessage)) {
      const messages = searchSlashMessages(client, newMessage);
      if (!messages.size) return;
      const toExecute = await preCheckBotSlashCommand({
        client,
        author: newMessage.interaction?.user!,
      });
      if (!toExecute) return;
      messages.forEach((cmd) => cmd.execute(client, newMessage, newMessage.interaction?.user!));
    }

    await emitMessageEdited(newMessage);

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

interface IPreCheckBotSlashCommand {
  client: Client;
  author: User;
}

const preCheckBotSlashCommand = async ({author, client}: IPreCheckBotSlashCommand) => {
  const userAccount = await userService.getUserAccount(author.id);

  return userAccount?.config.onOff ?? false;
};
