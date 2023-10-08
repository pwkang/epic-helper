import {SLASH_COMMAND} from '../constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.duel.name,
  description: SLASH_COMMAND.guild.duel.description,
  commandName: SLASH_COMMAND.guild.name,
  type: 'subcommand',
  builder: (subcommand) =>
    subcommand
      .addRoleOption((option) =>
        option
          .setName('role')
          .setDescription('Select the role of the guild to update')
          .setRequired(true)
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Channel to send duel log message')
      ),
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role', true);
    const configureGuild = await commandHelper.guildSettings.configure({
      server: interaction.guild!,
      roleId: role.id,
      author: interaction.user,
      client,
    });
    const messageOptions = await configureGuild.updateDuelLog({
      channelId: channel?.id,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
