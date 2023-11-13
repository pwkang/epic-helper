export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      NODE_ENV: 'development' | 'production';
      BOT_PREFIX: string;
      DEV_PREFIX: string;
      DEVS_ID: string;
      MONGO_URI: string;
      TOTAL_CLUSTERS: string;
      TOTAL_SHARDS: string;
      SENTRY_DSN: string;
      PATREON_CAMPAIGN_ID: string;
      PATREON_ACCESS_TOKEN: string;
      REDIS_URL: string;
      API_PORT: string;
      CONTENTFUL_SPACE_ID: string;
      CONTENTFUL_ACCESS_TOKEN: string;
      STATS_LEADERBOARD_CHANNEL: string;
    }
  }
}
