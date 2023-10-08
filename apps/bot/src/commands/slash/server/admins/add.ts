import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../../constant';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.admins.add.name,
  description: SLASH_COMMAND.server.admins.add.description,
  commandName: SLASH_COMMAND.server.name,
  groupName: SLASH_COMMAND.server.admins.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true,
  },
  builder: (subcommand) =>
    subcommand.addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to add as admin')
        .setRequired(true)
    ),
  execute: async (client, interaction) => {
    const user = interaction.options.getUser('user', true);
    if (!interaction.guild) return;
    const admins = await commandHelper.serverSettings.admin({
      server: interaction.guild,
    });
    const messageOptions = await admins.addAdmin({
      userId: user.id,
    });
    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
