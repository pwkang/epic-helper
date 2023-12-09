import {SLASH_COMMAND} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.duel.reset.name,
  description: SLASH_COMMAND.duel.reset.description,
  commandName: SLASH_COMMAND.duel.name,
  type: 'subcommand',
  builder: (subcommand) =>
    subcommand.addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('Select the role of the guild to reset')
        .setRequired(true),
    ),
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    if (!interaction.guild) return;
    const role = interaction.options.getRole('role', true);
    const resetDuelLog = await commandHelper.duel.reset({
      author: interaction.user,
      client,
      roleId: role.id,
      server: interaction.guild,
    });
    let event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: resetDuelLog.render(),
      interactive: true,
      onStop: () => {
        event = undefined;
      },
    });
    if (!event) return;
    event.every(async (interaction) => {
      return await resetDuelLog.replyInteraction({
        interaction,
      });
    });
  },
};
