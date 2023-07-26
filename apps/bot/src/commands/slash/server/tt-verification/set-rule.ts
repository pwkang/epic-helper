import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {SLASH_COMMAND_SERVER_NAME, SLASH_COMMAND_SERVER_TT_VERIFICATION_NAME} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'set-rule',
  description: 'Add a new assign rule for TT Verification',
  type: 'subcommand',
  commandName: SLASH_COMMAND_SERVER_NAME,
  groupName: SLASH_COMMAND_SERVER_TT_VERIFICATION_NAME,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  builder: (subcommand) =>
    subcommand
      .addRoleOption((option) =>
        option.setName('role').setDescription('Role to assign to verified users').setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName('min-tt')
          .setDescription('Minimum time travels amount to assign role')
          .setRequired(true)
          .setMinValue(0)
          .setMaxValue(999)
      )
      .addNumberOption((option) =>
        option
          .setName('max-tt')
          .setDescription('Maximum time travels amount to assign role')
          .setMinValue(0)
          .setMaxValue(999)
      )
      .addStringOption((option) =>
        option.setName('message').setDescription('Custom message to be attached in the embed')
      ),
  execute: async (client, interaction) => {
    if (!interaction.inGuild() || !interaction.guild) return;
    const role = interaction.options.getRole('role', true);
    const minTT = interaction.options.getNumber('min-tt', true);
    const maxTT = interaction.options.getNumber('max-tt') ?? undefined;
    const message = interaction.options.getString('message') ?? undefined;
    console.log({role, minTT, maxTT, message});
    const ttVerification = await commandHelper.serverSettings.ttVerification({
      server: interaction.guild,
    });
    if (!ttVerification) return;
    const messageOptions = await ttVerification.setRule({
      maxTT,
      minTT,
      roleId: role.id,
      message,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
