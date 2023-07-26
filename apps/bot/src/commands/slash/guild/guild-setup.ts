import {guildService} from '../../../services/database/guild.service';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import commandHelper from '../../../lib/epic-helper/command-helper';
import {SLASH_COMMAND_GUILD_NAME} from './constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'setup',
  description: 'Setup a new guild',
  type: 'subcommand',
  commandName: SLASH_COMMAND_GUILD_NAME,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  builder: (subcommand) =>
    subcommand
      .addRoleOption((option) =>
        option
          .setName('role')
          .setDescription('Only user with this role can trigger guild reminder, duel log, etc.')
          .setRequired(true)
      )
      .addUserOption((option) =>
        option
          .setName('leader')
          .setDescription('User that can modify the guild settings without admin permission')
      ),
  execute: async (client, interaction) => {
    const role = interaction.options.getRole('role', true);
    const leader = interaction.options.getUser('leader') ?? undefined;

    const isRoleUsed = await guildService.isRoleUsed({
      serverId: interaction.guildId!,
      roleId: role.id,
    });

    if (isRoleUsed) {
      return djsInteractionHelper.replyInteraction({
        client,
        interaction,
        options: {
          content: `Role ${role} is already used by another guild`,
          ephemeral: true,
        },
      });
    }
    const newGuild = await guildService.registerGuild({
      serverId: interaction.guildId!,
      roleId: role.id,
      leaderId: leader?.id,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: {
        embeds: [
          commandHelper.guildSettings.renderGuildSettingsEmbed({
            guildAccount: newGuild,
          }),
        ],
      },
    });
  },
};
