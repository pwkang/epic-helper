import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {SLASH_COMMAND} from '../../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.toggle.set.name,
  description: SLASH_COMMAND.guild.toggle.set.description,
  commandName: SLASH_COMMAND.guild.name,
  groupName: SLASH_COMMAND.guild.toggle.name,
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
      .addStringOption((option) =>
        option.setName('on').setDescription('Features to turn on'),
      )
      .addStringOption((option) =>
        option.setName('off').setDescription('Features to turn off'),
      ),
  execute: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    const guildRole = interaction.options.getRole('role', true);
    const onStr = interaction.options.getString('on');
    const offStr = interaction.options.getString('off');

    const toggleGuild = await commandHelper.guildSettings.configure({
      author: interaction.user,
      client,
      server: interaction.guild!,
      roleId: guildRole.id,
    });

    const messageOptions = await toggleGuild.updateToggle({
      on: onStr ?? undefined,
      off: offStr ?? undefined,
    });

    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
