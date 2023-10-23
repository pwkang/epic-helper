import {SLASH_COMMAND} from '../../constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.toggle.show.name,
  description: SLASH_COMMAND.server.toggle.show.description,
  commandName: SLASH_COMMAND.server.name,
  groupName: SLASH_COMMAND.server.toggle.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    isServerAdmin: true,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    if (!interaction.guild) return;
    const serverToggle = await commandHelper.toggle.server({
      server: interaction.guild,
    });
    if (!serverToggle) return;
    const messageOptions = serverToggle.render();
    if (!messageOptions) return;
    await interaction.reply(messageOptions);
  },
};
