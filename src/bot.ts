import {ClusterClient, getInfo} from 'discord-hybrid-sharding';
import {Client, Collection, IntentsBitField} from 'discord.js';

import * as dotenv from 'dotenv';
import loadCommands from './handler/commands.handler';
import loadBotEvents from './handler/bot-events.handler';
import loadCronJob from './handler/cron.handler';
import {redisClient} from './services/redis/redis.service';
import {initSentry} from './handler/sentry.handler';

dotenv.config();
const environment = process.env.NODE_ENV || 'development';

const shards = environment === 'development' ? 'auto' : getInfo().SHARD_LIST;
const shardCount = environment === 'development' ? 1 : getInfo().TOTAL_SHARDS;

const client = new Client({
  intents: new IntentsBitField().add(['Guilds', 'GuildMessages', 'MessageContent']),
  shardCount,
  shards,
});

client.prefixCommands = new Collection();
client.slashCommands = new Collection();

if (environment === 'production') {
  client.cluster = new ClusterClient(client); // initialize the Client, so we access the .broadcastEval()
  initSentry();
}

Promise.all([
  loadCommands(client),
  loadBotEvents(client),
  redisClient.connect(),
  loadCronJob(client),
]).then(() => {
  client.login(process.env.BOT_TOKEN).catch(console.error);
});
