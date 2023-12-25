import type {Collection} from 'discord.js';
import type {ClusterClient} from 'discord-hybrid-sharding';
import type {getUptime} from '../utils/uptime';
import type {djsMessageHelper} from '../lib/discordjs/message';

declare module 'discord.js' {
  export interface Client {
    cluster?: ClusterClient<Client>;
    prefixCommands: Collection<string, PrefixCommand>;
    slashCommands: Collection<string, SlashCommand>;
    slashMessages: Collection<string, SlashMessage>;
    botMessages: Collection<string, BotMessage>;
    fetchedMemberGuilds: Collection<string, boolean>;
    mainUsers: Set<string>;
    clusterSession?: string;
    utils: {
      getUptime: typeof getUptime;
      djsMessageHelper: typeof djsMessageHelper;
    };
  }
}
