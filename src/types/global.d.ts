import type {ClusterClient} from 'discord-hybrid-sharding';
import type {Client, Collection} from 'discord.js';

declare global {
  interface BotClient extends Client {
    cluster?: ClusterClient<unknown>;
    commands: Collection<string, object>;
  }

  type ValuesOf<T extends Record<string, unknown>> = T[keyof T];

  interface PrefixCommand {
    name: string;
    execute: (client: BotClient) => Promise<void>;
  }

  interface BotEvent {
    once: boolean;
    eventName: unknown;
    execute: (client: BotClient, ...args: any[]) => Promise<void>;
  }
}

export {};
