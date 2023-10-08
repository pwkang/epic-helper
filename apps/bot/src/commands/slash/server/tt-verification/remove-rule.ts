import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.ttVerification.removeRule.name,
  description: SLASH_COMMAND.server.ttVerification.removeRule.description,
  commandName: SLASH_COMMAND.server.name,
  groupName: SLASH_COMMAND.server.ttVerification.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true,
  },
  builder: (subcommand) =>
    subcommand.addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('Role to remove from verified users')
        .setRequired(true)
    ),
  execute: async (client, interaction) => {
    if (!interaction.inGuild() || !interaction.guild) return;
    const role = interaction.options.getRole('role', true);
    const ttVerification = await commandHelper.serverSettings.ttVerification({
      server: interaction.guild,
    });
    if (!ttVerification) return;
    const messageOptions = await ttVerification.removeRule({
      roleId: role.id,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
