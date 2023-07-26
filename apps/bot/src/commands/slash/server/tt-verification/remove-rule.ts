import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {SLASH_COMMAND_SERVER_NAME, SLASH_COMMAND_SERVER_TT_VERIFICATION_NAME} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'remove-rule',
  description: 'Remove an existing rule',
  type: 'subcommand',
  commandName: SLASH_COMMAND_SERVER_NAME,
  groupName: SLASH_COMMAND_SERVER_TT_VERIFICATION_NAME,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  builder: (subcommand) =>
    subcommand.addRoleOption((option) =>
      option.setName('role').setDescription('Role to remove from verified users').setRequired(true)
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
