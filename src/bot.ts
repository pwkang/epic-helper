import {ClusterClient, getInfo} from 'discord-hybrid-sharding';
import {Client, Collection, Events, IntentsBitField} from 'discord.js';

import * as dotenv from 'dotenv';
import loadPrefixCommands from './handler/commands.handler';

dotenv.config();
const environment = process.env.NODE_ENV || 'development';

const shards = environment === 'development' ? 'auto' : getInfo().SHARD_LIST;

const shardCount = environment === 'development' ? 1 : getInfo().TOTAL_SHARDS;

const client: BotClient = <BotClient>new Client({
  intents: new IntentsBitField().add(['Guilds', 'GuildMessages']),
  shardCount,
  shards,
});

client.commands = new Collection();

if (environment === 'production') {
  client.cluster = new ClusterClient(client); // initialize the Client, so we access the .broadcastEval()
}

client.once(Events.ClientReady, (client) => {
  const c = client as BotClient;
  console.log(`Logged in as ${client.user.tag}!`);
  loadPrefixCommands(c);
});

client.login(process.env.BOT_TOKEN).catch(console.error);
