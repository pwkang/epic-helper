import type {Client, ClientEvents, Message, User} from 'discord.js';
import {ChatInputCommandInteraction} from 'discord.js';
import type {ScheduleOptions} from 'node-cron';
import {ValuesOf} from '@epic-helper/ts-utils';
import {PREFIX_COMMAND_TYPE, SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

declare global {
  interface PrefixCommand {
    name: string;
    commands: string[];
    execute: (client: Client, message: Message, args: string[]) => void | Promise<void>;
    type: ValuesOf<typeof PREFIX_COMMAND_TYPE>;
  }

  interface SlashCommand<T = ChatInputCommandInteraction> {
    name: string;
    interactionType: T;
    execute: (client: Client, interaction: T) => Promise<void>;
    builder: SlashCommandBuilder;
  }

  interface SlashMessage {
    name: string;
    commandName: string[];
    bot: ValuesOf<typeof SLASH_MESSAGE_BOT_TYPE>;
    execute: (client: Client, message: Message, author: User) => Promise<void>;
  }

  interface BotEvent {
    once: boolean;
    eventName: keyof ClientEvents;
    execute: (client: Client, ...args: any[]) => Promise<void>;
  }

  interface CronJob {
    name: string;
    expression: string;
    disabled?: boolean;
    cronOptions: ScheduleOptions;
    execute: (client: Client) => Promise<void>;
  }
}

export {};
