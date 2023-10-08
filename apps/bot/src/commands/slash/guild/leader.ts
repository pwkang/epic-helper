import {SLASH_COMMAND} from '../constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.leader.name,
  description: SLASH_COMMAND.guild.leader.description,
  commandName: SLASH_COMMAND.guild.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true
  },
  builder: (subcommand) =>
    subcommand
      .addRoleOption((option) =>
        option
          .setName('role')
          .setDescription('Select the role of the guild to update')
          .setRequired(true)
      )
      .addUserOption((option) =>
        option
          .setName('leader')
          .setDescription(
            'User that can modify the guild settings without admin permission'
          )
          .setRequired(true)
      ),
  execute: async (client, interaction) => {
    const role = interaction.options.getRole('role', true);
    const leader = interaction.options.getUser('leader', true);

    const configureGuild = await commandHelper.guildSettings.configure({
      client,
      roleId: role.id,
      server: interaction.guild!,
      author: interaction.user
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: await configureGuild.setLeader({
        leader: leader
      })
    });
  }
};
