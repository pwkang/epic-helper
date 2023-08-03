import {Client, Events, Message, User} from 'discord.js';
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
