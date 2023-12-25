import type {Client, Message} from 'discord.js';
import {Events} from 'discord.js';
import {DEVS_ID, EPIC_RPG_ID, PREFIX, PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {preCheckCommand} from '../../utils/command-precheck';
import commandHelper from '../../lib/epic-helper/command-helper';
import type {ValuesOf} from '@epic-helper/types';

export default <BotEvent>{
  eventName: Events.MessageCreate,
  once: false,
  execute: async (client, message: Message) => {
    if (!message.inGuild()) return;
    if (!client.readyAt) return;
    if (client.readyAt > message.createdAt) return;

    const isClusterActive = await commandHelper.cluster.isClusterActive(client);
    if (!isClusterActive) return;

    if (
      isBotSlashCommand(message) &&
      isNotDeferred(message) &&
      message.interaction
    ) {
      const messages = searchSlashMessages(client, message);
      if (!messages.size) return;

      messages.forEach((cmd) => {
        const toExecute = preCheckCommand({
          client,
          author: message.interaction!.user,
          message,
          preCheck: cmd.preCheck,
          server: message.guild,
        });
        if (!toExecute) return;
        cmd.execute(client, message, message.interaction!.user);
      });
    }

    if (isSentByUser(message)) {
      const result = searchCommand(client, message);
      if (!result) return;
      const toExecute = await preCheckCommand({
        client,
        preCheck: result.command.preCheck,
        author: message.author,
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
      (name) =>
        name.toLowerCase() === message.interaction?.commandName?.toLowerCase(),
    ),
  );

const isRpgCommand = (message: Message) =>
  message.content
    .trim()
    .toLowerCase()
    .startsWith(`${PREFIX.rpg.toLowerCase()}`) ||
  message.mentions.has(EPIC_RPG_ID);

const isBotCommand = (message: Message) =>
  PREFIX.bot &&
  message.content.trim().toLowerCase().startsWith(PREFIX.bot.toLowerCase());

const validateCommand = (commands: string[], args: string[]) => {
  return commands.some((cmd) =>
    cmd
      .split(' ')
      .every((name, i) => name?.toLowerCase() === args[i]?.toLowerCase()),
  );
};

const getMatchedCommandLength = (commands: string[], args: string[]) => {
  const matched = commands.find((cmd) =>
    cmd
      .split(' ')
      .every((name, i) => name?.toLowerCase() === args[i]?.toLowerCase()),
  );
  return matched?.split(' ').length ?? 0;
};

function searchCommand(
  client: Client,
  message: Message,
): {command: PrefixCommand; args: string[]} | null {
  const messageContent = message.content.toLowerCase().trim();
  if (messageContent === '') return null;
  let args: string[] = [];
  let command;
  let commandType: ValuesOf<typeof PREFIX_COMMAND_TYPE>;

  if (isRpgCommand(message)) {
    if (messageContent.startsWith(`${PREFIX.rpg}`)) {
      args = messageContent.split(/[\n\s]/).slice(1);
    } else if (message.mentions.has(EPIC_RPG_ID)) {
      args = messageContent
        .replace(`<@${EPIC_RPG_ID}>`, '')
        .split(/[\n\s]/)
        .filter((arg) => arg !== '');
    }

    commandType = PREFIX_COMMAND_TYPE.rpg;
  }

  if (PREFIX.bot && isBotCommand(message)) {
    args = messageContent
      .slice(PREFIX.bot.length)
      .trim()
      .split(/[\n\s]/);

    commandType = PREFIX_COMMAND_TYPE.bot;
  }
  if (
    DEVS_ID.includes(message.author.id) &&
    PREFIX.dev &&
    messageContent.startsWith(PREFIX.dev)
  ) {
    args = messageContent
      .slice(PREFIX.dev.length)
      .trim()
      .split(/[\n\s]/);

    commandType = PREFIX_COMMAND_TYPE.dev;
  }

  const matchedCommands = client.prefixCommands.filter(
    (cmd) => cmd.type === commandType && validateCommand(cmd.commands, args),
  );
  if (matchedCommands.size === 1) {
    command = matchedCommands.first();
  } else {
    command = matchedCommands
      .sort(
        (a, b) =>
          getMatchedCommandLength(b.commands, args) -
          getMatchedCommandLength(a.commands, args),
      )
      .first();
  }

  return command ? {command, args} : null;
}

const isBotSlashCommand = (message: Message) =>
  message.interaction && message.author.bot;
const isSentByUser = (message: Message) => !message.author.bot;

const isSentByBot = (message: Message) => message.author.bot && message.author.id == EPIC_RPG_ID;

const isNotDeferred = (message: Message) =>
  !(message.content === '' && !message.embeds.length);

const searchBotMatchedCommands = (client: Client, message: Message) =>
  client.botMessages.filter(
    (cmd) => message.author.id === cmd.bot && cmd.match(message),
  );
