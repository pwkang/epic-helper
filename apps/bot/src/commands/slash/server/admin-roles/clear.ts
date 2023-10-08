import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../../constant';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.adminRoles.clear.name,
  description: SLASH_COMMAND.server.adminRoles.clear.description,
  commandName: SLASH_COMMAND.server.name,
  groupName: SLASH_COMMAND.server.adminRoles.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true,
  },
  execute: async (client, interaction) => {
    if (!interaction.guild) return;
    const admins = await commandHelper.serverSettings.adminRole({
      server: interaction.guild,
    });
    const messageOptions = await admins.reset();
    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
