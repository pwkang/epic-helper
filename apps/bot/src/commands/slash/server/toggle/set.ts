import {SLASH_COMMAND} from '../../constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.toggle.set.name,
  description: SLASH_COMMAND.server.toggle.set.description,
  commandName: SLASH_COMMAND.server.name,
  groupName: SLASH_COMMAND.server.toggle.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    isServerAdmin: true,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  builder: (subcommand) =>
    subcommand
      .addStringOption((option) =>
        option.setName('on').setDescription('Features to turn on')
      )
      .addStringOption((option) =>
        option.setName('off').setDescription('Features to turn off')
      ),
  execute: async (client, interaction) => {
    if (!interaction.guild) return;
    const onStr = interaction.options.getString('on');
    const offStr = interaction.options.getString('off');
    const serverToggle = await commandHelper.toggle.server({
      server: interaction.guild,
    });
    if (!serverToggle) return;
    const messageOptions = await serverToggle.update({
      on: onStr ? onStr : undefined,
      off: offStr ? offStr : undefined,
    });
    if (!messageOptions) return;
    await interaction.reply(messageOptions);
  },
};
