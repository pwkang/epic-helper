import {ClusterClient, getInfo} from 'discord-hybrid-sharding';
import {Client, Collection, IntentsBitField} from 'discord.js';

import * as dotenv from 'dotenv';
import loadCommands from './handler/on-start/commands.handler';
import loadBotEvents from './handler/on-start/bot-events.handler';
import loadCronJob from './handler/on-start/cron.handler';
import {redisClient} from './services/redis/redis.service';
import {initSentry} from './handler/on-start/sentry.handler';
import {logger} from './utils/logger';
import patreonService from './services/patreon/patreon.service';

dotenv.config();
const environment = process.env.NODE_ENV || 'development';

const shards = environment === 'development' ? 'auto' : getInfo().SHARD_LIST;
const shardCount = environment === 'development' ? 1 : getInfo().TOTAL_SHARDS;

const client = new Client({
  intents: new IntentsBitField().add([
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]),
  shardCount,
  shards,
});

client.prefixCommands = new Collection();
client.slashCommands = new Collection();
client.slashMessages = new Collection();

if (environment === 'production') {
  client.cluster = new ClusterClient(client); // initialize the Client, so we access the .broadcastEval()
  initSentry();
}

Promise.all([
  loadCommands(client),
  loadBotEvents(client),
  redisClient.connect(),
  loadCronJob(client),
]).then(async () => {
  logger({
    client,
    message: 'All handlers loaded, connecting to Discord...',
  });
  client.login(process.env.BOT_TOKEN).catch((error) => {
    logger({
      client,
      message: error.message,
    });
  });
});
