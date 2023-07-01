import {SlashCommandBuilder} from 'discord.js';
import {showUserToggleSlash} from './subcommand/showUserToggle';
import {setUserToggleSlash} from './subcommand/setUserToggle';
import {resetUserToggleSlash} from './subcommand/resetUserToggle';

export default <SlashCommand>{
  name: 'toggle',
  builder: new SlashCommandBuilder()
    .setName('toggle')
    .setDescription('Turn on/off features')
    .addSubcommand((subcommand) => subcommand.setName('show').setDescription('Show user features'))
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Set user features')
        .addStringOption((option) =>
          option.setName('on').setDescription('Type the ID of the settings. e.g. a1 b2a')
        )
        .addStringOption((option) =>
          option.setName('off').setDescription('Type the ID of the settings. e.g. a1 b2a')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('reset').setDescription('Reset user features')
    ),
  execute: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'show':
        await showUserToggleSlash({client, interaction});
        break;
      case 'set':
        await setUserToggleSlash({client, interaction});
        break;
      case 'reset':
        await resetUserToggleSlash({client, interaction});
        break;
    }
  },
};
