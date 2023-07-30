import {Client, Events, Message, User} from 'discord.js';
import {DEVS_ID, EPIC_RPG_ID, PREFIX, PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {userService} from '../../services/database/user.service';
import {preCheckCommand} from '../../utils/command-precheck';

export default <BotEvent>{
  eventName: Events.MessageCreate,
  once: false,
  execute: async (client, message: Message) => {
    if (!message.inGuild()) return;
    if (isBotSlashCommand(message) && isNotDeferred(message)) {
      const messages = searchSlashMessages(client, message);
      if (!messages.size) return;
      const toExecute = await preCheckBotSlashCommand({
        client,
        author: message.interaction?.user!,
      });
      if (!toExecute) return;
      messages.forEach((cmd) => cmd.execute(client, message, message.interaction?.user!));
    }

    if (isSentByUser(message)) {
      const result = searchCommand(client, message);
      if (!result) return;
      const toExecute = await preCheckCommand({
        client,
        preCheck: result.command.preCheck,
        author: message.author,
        channelId: message.channelId,
        server: message.guild,
        message,
      });
      if (!toExecute) return;
      await result.command.execute(client, message, result.args);
    }

    if (isSentByBot(message)) {
      const commands = searchBotMatchedCommands(client, message);
      if (!commands.size) return;
      commands.forEach((cmd) => cmd.execute(client, message));
    }
  },
};

const searchSlashMessages = (client: Client, message: Message) =>
  client.slashMessages.filter((cmd) =>
    cmd.commandName.some(
      (name) => name.toLowerCase() === message.interaction?.commandName?.toLowerCase()
    )
  );

const trimWhitespace = (str: string) => str.split('\n').join('').replace(/\s+/g, ' ').trim();

const isRpgCommand = (message: Message) =>
  trimWhitespace(message.content).toLowerCase().startsWith(`${PREFIX.rpg.toLowerCase()} `) ||
  message.mentions.has(EPIC_RPG_ID);

const isBotCommand = (message: Message) =>
  PREFIX.bot && trimWhitespace(message.content).toLowerCase().startsWith(PREFIX.bot.toLowerCase());

const validateCommand = (commands: string[], args: string[]) => {
  return commands.some((cmd) =>
    cmd.split(' ').every((name, i) => name?.toLowerCase() === args[i]?.toLowerCase())
  );
};

const getMatchedCommandLength = (commands: string[], args: string[]) => {
  const matched = commands.find((cmd) =>
    cmd.split(' ').every((name, i) => name?.toLowerCase() === args[i]?.toLowerCase())
  );
  return matched?.split(' ').length ?? 0;
};

function searchCommand(
  client: Client,
  message: Message
): {command: PrefixCommand; args: string[]} | null {
  const messageContent = trimWhitespace(message.content.toLowerCase());
  if (messageContent === '') return null;
  let args: string[] = [];
  let command;
  let commandType: ValuesOf<typeof PREFIX_COMMAND_TYPE>;

  if (isRpgCommand(message)) {
    if (messageContent.startsWith(`${PREFIX.rpg} `)) {
      args = messageContent.split(' ').slice(1);
    } else if (message.mentions.has(EPIC_RPG_ID)) {
      args = messageContent
        .replace(`<@${EPIC_RPG_ID}>`, '')
        .split(' ')
        .filter((arg) => arg !== '');
    }

    commandType = PREFIX_COMMAND_TYPE.rpg;
  }

  if (PREFIX.bot && isBotCommand(message)) {
    args = messageContent.slice(PREFIX.bot.length).trim().split(' ');

    commandType = PREFIX_COMMAND_TYPE.bot;
  }
  if (DEVS_ID.includes(message.author.id) && PREFIX.dev && messageContent.startsWith(PREFIX.dev)) {
    args = messageContent.slice(PREFIX.dev.length).trim().split(' ');

    commandType = PREFIX_COMMAND_TYPE.dev;
  }

  const matchedCommands = client.prefixCommands.filter(
    (cmd) => cmd.type === commandType && validateCommand(cmd.commands, args)
  );
  if (matchedCommands.size === 1) {
    command = matchedCommands.first();
  } else {
    command = matchedCommands
      .sort(
        (a, b) =>
          getMatchedCommandLength(b.commands, args) - getMatchedCommandLength(a.commands, args)
      )
      .first();
  }

  return command ? {command, args} : null;
}

const isBotSlashCommand = (message: Message) => message.interaction && message.author.bot;
const isSentByUser = (message: Message) => !message.author.bot;

const isSentByBot = (message: Message) => message.author.bot;

const isNotDeferred = (message: Message) => !(message.content === '' && !message.embeds.length);

const searchBotMatchedCommands = (client: Client, message: Message) =>
  client.botMessages.filter((cmd) => message.author.id === cmd.bot && cmd.match(message));

interface IPreCheckBotSlashCommand {
  client: Client;
  author: User;
}

const preCheckBotSlashCommand = async ({author, client}: IPreCheckBotSlashCommand) => {
  const userAccount = await userService.getUserAccount(author.id);

  return userAccount?.config.onOff ?? false;
};
