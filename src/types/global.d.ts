import type {Client, Message, SlashCommandBuilder, User} from 'discord.js';
import {ChatInputCommandInteraction} from 'discord.js';
import type {COMMAND_TYPE} from '../constants/bot';
import {OTHER_BOT_TYPE} from '../constants/bot';
import type {ScheduleOptions} from 'node-cron';

declare global {
  type ValuesOf<T extends Record<string, unknown>> = T[keyof T];

  interface PrefixCommand {
    name: string;
    commands: string[];
    execute: (client: Client, message: Message, args: string[]) => void | Promise<void>;
    type: ValuesOf<typeof COMMAND_TYPE>;
  }

  interface SlashCommand<T = ChatInputCommandInteraction> {
    name: string;
    interactionType: T;
    execute: (client: Client, interaction: T) => Promise<void>;
    builder: SlashCommandBuilder;
  }

  interface SlashCommandOtherBot {
    name: string;
    commandName: string[];
    bot: ValuesOf<typeof OTHER_BOT_TYPE>;
    execute: (client: Client, message: Message, author: User) => Promise<void>;
  }

  interface BotEvent {
    once: boolean;
    eventName: unknown;
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
