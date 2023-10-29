import {SLASH_COMMAND} from '../../constant';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.donorRoles.remove.name,
  description: SLASH_COMMAND.server.donorRoles.remove.description,
  commandName: SLASH_COMMAND.server.name,
  groupName: SLASH_COMMAND.server.donorRoles.name,
  type: 'subcommand',
  preCheck: {
    isServerAdmin: true,
  },
  builder: (subcommand) =>
    subcommand.addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('The role to be removed')
        .setRequired(true),
    ),
  execute: async (client, interaction) => {
    if (!interaction.guild) return;
    const role = interaction.options.getRole('role', true);
    if (!interaction.guild) return;
    const donorRoleSettings = await commandHelper.serverSettings.donorRole({
      serverId: interaction.guild.id,
      client,
    });
    const messageOptions = await donorRoleSettings.removeRoles([role.id]);
    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
