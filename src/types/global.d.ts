import type {ClusterClient} from 'discord-hybrid-sharding';
import type {Client, Collection, Interaction, Message, SlashCommandBuilder} from 'discord.js';

declare global {
  interface BotClient extends Client {
    cluster?: ClusterClient<unknown>;
    commands: Collection<string, object>;
    slashCommands: Collection<string, object>;
  }

  type ValuesOf<T extends Record<string, unknown>> = T[keyof T];

  interface PrefixCommand {
    name: string;
    execute: (client: BotClient, message: Message) => Promise<void>;
  }

  interface SlashCommand {
    name: string;
    execute: (client: BotClient, interaction: Interaction) => Promise<void>;
    builder: SlashCommandBuilder;
  }

  interface BotEvent {
    once: boolean;
    eventName: unknown;
    execute: (client: BotClient, ...args: any[]) => Promise<void>;
  }
}

export {};
