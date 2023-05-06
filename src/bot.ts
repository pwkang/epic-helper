import {ClusterClient, getInfo} from 'discord-hybrid-sharding';
import {Client, Collection, IntentsBitField} from 'discord.js';

import * as dotenv from 'dotenv';
import loadPrefixCommands from './handler/commands.handler';
import loadBotEvents from './handler/bot-events.handler';

dotenv.config();
const environment = process.env.NODE_ENV || 'development';

const shards = environment === 'development' ? 'auto' : getInfo().SHARD_LIST;
const shardCount = environment === 'development' ? 1 : getInfo().TOTAL_SHARDS;

const client: BotClient = <BotClient>new Client({
  intents: new IntentsBitField().add(['Guilds', 'GuildMessages', 'MessageContent']),
  shardCount,
  shards,
});

client.commands = new Collection();

if (environment === 'production') {
  client.cluster = new ClusterClient(client); // initialize the Client, so we access the .broadcastEval()
}

loadPrefixCommands(client);
loadBotEvents(client);

client.login(process.env.BOT_TOKEN).catch(console.error);
