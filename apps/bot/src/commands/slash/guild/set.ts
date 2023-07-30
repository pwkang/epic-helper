import {guildService} from '../../../services/database/guild.service';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import commandHelper from '../../../lib/epic-helper/command-helper';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.set.name,
  description: SLASH_COMMAND.guild.set.description,
  commandName: SLASH_COMMAND.guild.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  builder: (subcommand) =>
    subcommand
      .addRoleOption((option) =>
        option
          .setName('role')
          .setDescription('Select the role of the guild to update')
          .setRequired(true)
      )
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Channel to send reminder message')
      )
      .addNumberOption((option) =>
        option
          .setName('target-stealth')
          .setDescription('Target stealth to switch reminder from upgrade to raid')
      )
      .addStringOption((option) =>
        option
          .setName('upgrade-message')
          .setDescription('Message to send when stealth is below target stealth')
      )
      .addStringOption((option) =>
        option
          .setName('raid-message')
          .setDescription('Message to send when stealth is above target stealth')
      ),
  execute: async (client, interaction) => {
    const role = interaction.options.getRole('role', true);
    const channel = interaction.options.getChannel('channel');
    const targetStealth = interaction.options.getNumber('target-stealth');
    const upgradeMessage = interaction.options.getString('upgrade-message') ?? undefined;
    const raidMessage = interaction.options.getString('raid-message') ?? undefined;

    const isRoleUsed = await guildService.isRoleUsed({
      serverId: interaction.guildId!,
      roleId: role.id,
    });
    if (!isRoleUsed) {
      return djsInteractionHelper.replyInteraction({
        client,
        interaction,
        options: {
          content: `There is no guild with role ${role} setup in this server`,
          ephemeral: true,
        },
      });
    }

    const updatedGuild = await guildService.updateGuildReminder({
      channelId: channel?.id,
      targetStealth: targetStealth === null ? undefined : targetStealth,
      upgradeMessage,
      raidMessage,
      serverId: interaction.guildId!,
      roleId: role.id,
    });
    if (!updatedGuild) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: {
        embeds: [
          commandHelper.guildSettings.renderGuildSettingsEmbed({
            guildAccount: updatedGuild!,
          }),
        ],
      },
    });
  },
};
