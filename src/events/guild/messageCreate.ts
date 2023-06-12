import {Client, Events, Message} from 'discord.js';
import {PREFIX_COMMAND_TYPE, DEVS_ID, EPIC_RPG_ID, PREFIX} from '../../constants/bot';

export default <BotEvent>{
  eventName: Events.MessageCreate,
  once: false,
  execute: async (client, message: Message) => {
    if (isBotSlashCommand(message) && isNotDeferred(message)) {
      const messages = searchSlashMessages(client, message);
      if (!messages.size) return;
      messages.forEach((cmd) => cmd.execute(client, message, message.interaction?.user!));
    }

    if (isSentByUser(message)) {
      const result = searchCommand(client, message);
      if (!result) return;
      await result.command.execute(client, message, result.args);
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

const isNotDeferred = (message: Message) => !(message.content === '' && !message.embeds.length);
