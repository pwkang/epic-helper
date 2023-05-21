import {Client, Events, Message} from 'discord.js';
import {COMMAND_TYPE, DEVS_ID, EPIC_RPG_ID, PREFIX} from '../../constants/bot';

export default <BotEvent>{
  eventName: Events.MessageCreate,
  once: false,
  execute: async (client, message: Message) => {
    if (!message.author.bot) {
      const result = searchCommand(client, message);
      if (!result) return;
      await result.command.execute(client, message, result.args);
    }
  },
};

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

function searchCommand(
  client: Client,
  message: Message
): {command: PrefixCommand; args: string[]} | null {
  const messageContent = trimWhitespace(message.content);
  if (messageContent === '') return null;
  let args: string[] = [];
  let command;

  if (isRpgCommand(message)) {
    if (messageContent.startsWith(`${PREFIX.rpg} `)) {
      args = messageContent.split(' ').slice(1);
      console.log(args);
    } else if (message.mentions.has(EPIC_RPG_ID)) {
      args = messageContent
        .replace(`<@${EPIC_RPG_ID}>`, '')
        .split(' ')
        .filter((arg) => arg !== '');
    }

    command = client.prefixCommands.find(
      (cmd) => cmd.type === COMMAND_TYPE.rpg && validateCommand(cmd.commands, args)
    );
  }

  if (PREFIX.bot && isBotCommand(message)) {
    args = messageContent.slice(PREFIX.bot.length).trim().split(' ');

    command = client.prefixCommands.find(
      (cmd) => cmd.type === COMMAND_TYPE.bot && validateCommand(cmd.commands, args)
    );
  }
  if (DEVS_ID.includes(message.author.id) && PREFIX.dev && messageContent.startsWith(PREFIX.dev)) {
    args = messageContent.slice(PREFIX.dev.length).trim().split(' ');

    command = client.prefixCommands.find(
      (cmd) => cmd.type === COMMAND_TYPE.dev && validateCommand(cmd.commands, args)
    );
  }

  return command ? {command, args} : null;
}
