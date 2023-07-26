export default <SlashCommand>{
  name: 'test',
  description: 'Test',
  type: 'command',
  preCheck: {},
  execute: async (client, interaction) => {
    await interaction.reply('Test');
  },
};
