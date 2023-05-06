import type {Client, Interaction, Message, SlashCommandBuilder} from 'discord.js';
import {COMMAND_TYPE} from '../constants/commands';

declare global {
  type ValuesOf<T extends Record<string, unknown>> = T[keyof T];

  interface PrefixCommand {
    name: string;
    commands: string[];
    execute: (client: Client, message: Message) => Promise<void>;
    type: ValuesOf<typeof COMMAND_TYPE>;
  }

  interface SlashCommand {
    name: string;
    execute: (client: Client, interaction: Interaction) => Promise<void>;
    builder: SlashCommandBuilder;
  }

  interface BotEvent {
    once: boolean;
    eventName: unknown;
    execute: (client: Client, ...args: any[]) => Promise<void>;
  }
}

export {};
