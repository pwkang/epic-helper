import {Client, Events, Message} from 'discord.js';
import {COMMAND_TYPE, DEVS_ID, EPIC_RPG_ID, PREFIX} from '../../constants/bot';

export default <BotEvent>{
  eventName: Events.MessageCreate,
  once: false,
  execute: async (client, message: Message) => {
    if (!message.author.bot) {
      const command = searchCommand(client, message);
      if (!command) return;
      await command.execute(client, message);
    }
  },
};

const isRpgCommand = (message: Message) =>
  message.content.toLowerCase().startsWith(`${PREFIX.rpg.toLowerCase()} `) ||
  message.mentions.has(EPIC_RPG_ID);

const isBotCommand = (message: Message) =>
  PREFIX.bot && message.content.toLowerCase().startsWith(PREFIX.bot.toLowerCase());

const validateCommand = (commands: string[], args: string[]) => {
  return commands.some((cmd) =>
    cmd.split(' ').every((name, i) => name?.toLowerCase() === args[i]?.toLowerCase())
  );
};

function searchCommand(client: Client, message: Message): PrefixCommand | null {
  const messageContent = message.content.toLowerCase();
  if (messageContent === '') return null;

  if (isRpgCommand(message)) {
    let args: string[] = [];
    if (messageContent.startsWith(`${PREFIX.rpg} `)) {
      args = messageContent.split(' ').slice(1);
    } else if (message.mentions.has(EPIC_RPG_ID)) {
      args = messageContent
        .replace(`<@${EPIC_RPG_ID}>`, '')
        .split(' ')
        .filter((arg) => arg !== '');
    }

    const command = client.prefixCommands.find(
      (cmd) => cmd.type === COMMAND_TYPE.rpg && validateCommand(cmd.commands, args)
    );
    if (!command) return null;
    return command;
  }

  if (PREFIX.bot && isBotCommand(message)) {
    const args = messageContent.slice(PREFIX.bot.length).trim().split(' ');

    const command = client.prefixCommands.find(
      (cmd) => cmd.type === COMMAND_TYPE.bot && validateCommand(cmd.commands, args)
    );

    if (!command) return null;
    return command;
  }
  if (DEVS_ID.includes(message.author.id) && PREFIX.dev && messageContent.startsWith(PREFIX.dev)) {
    const args = messageContent.slice(PREFIX.dev.length).trim().split(' ');

    const command = client.prefixCommands.find(
      (cmd) => cmd.type === COMMAND_TYPE.dev && validateCommand(cmd.commands, args)
    );

    if (!command) return null;
    return command;
  }

  return null;
}
