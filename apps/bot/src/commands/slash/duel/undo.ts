import {SLASH_COMMAND} from '../constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.duel.undo.name,
  description: SLASH_COMMAND.duel.undo.description,
  commandName: SLASH_COMMAND.duel.name,
  type: 'subcommand',
  builder: (subcommand) => subcommand,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    if (!interaction.inGuild() || !interaction.guild) return;
    const embed = await commandHelper.duel.undo({
      user: interaction.user,
      client,
      commandChannelId: interaction.channelId,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: {
        embeds: [embed],
      },
    });
  },
};
