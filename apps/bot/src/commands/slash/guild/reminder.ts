import {SLASH_COMMAND} from '../constant';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import commandHelper from '../../../lib/epic-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.reminder.name,
  description: SLASH_COMMAND.guild.reminder.description,
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
          .setRequired(true),
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Channel to send reminder message'),
      )
      .addNumberOption((option) =>
        option
          .setName('target-stealth')
          .setDescription(
            'Target stealth to switch reminder from upgrade to raid',
          ),
      )
      .addStringOption((option) =>
        option
          .setName('upgrade-message')
          .setDescription(
            'Message to send when stealth is below target stealth',
          ),
      )
      .addStringOption((option) =>
        option
          .setName('raid-message')
          .setDescription(
            'Message to send when stealth is above target stealth',
          ),
      ),
  execute: async (client, interaction) => {
    const role = interaction.options.getRole('role', true);
    const channel = interaction.options.getChannel('channel');
    const targetStealth =
      interaction.options.getNumber('target-stealth') ?? undefined;
    const upgradeMessage =
      interaction.options.getString('upgrade-message') ?? undefined;
    const raidMessage =
      interaction.options.getString('raid-message') ?? undefined;

    const configureGuild = await commandHelper.guildSettings.configure({
      server: interaction.guild!,
      roleId: role.id,
      author: interaction.user,
      client,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: await configureGuild.updateGuild({
        channelId: channel?.id,
        roleId: role.id,
        targetStealth,
        upgradeMessage,
        raidMessage,
      }),
    });
  },
};
