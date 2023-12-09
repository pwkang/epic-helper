module.exports = {
  apps: [
    {
      name: 'epic-helper',
      script: './apps/bot/dist/index.js',
      time: true,
    },
    {
      name: 'epic-helper-api',
      script: './apps/api/dist/index.js',
      time: true,
    },
  ],
};
