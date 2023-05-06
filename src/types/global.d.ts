import type {ClusterClient} from 'discord-hybrid-sharding';
import type {Client, Collection} from 'discord.js';
import {Message} from 'discord.js';

declare global {
  interface BotClient extends Client {
    cluster?: ClusterClient<unknown>;
    commands: Collection<string, object>;
  }

  interface PrefixCommand {
    name: string;
    execute: (client: BotClient) => Promise<void>;
  }
}

export {};
