import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../../constant';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.adminRoles.remove.name,
  description: SLASH_COMMAND.server.adminRoles.remove.description,
  commandName: SLASH_COMMAND.server.name,
  groupName: SLASH_COMMAND.server.adminRoles.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true
  },
  builder: (subcommand) =>
    subcommand.addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('The role to remove from admin roles')
        .setRequired(true)
    ),
  execute: async (client, interaction) => {
    const role = interaction.options.getRole('role', true);
    if (!interaction.guild) return;
    const admins = await commandHelper.serverSettings.adminRole({
      server: interaction.guild
    });
    const messageOptions = await admins.removeRole({
      roleId: role.id
    });
    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions
    });
  }
};
