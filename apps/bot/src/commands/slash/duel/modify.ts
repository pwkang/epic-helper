import {SLASH_COMMAND} from '../constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.duel.modify.name,
  description: SLASH_COMMAND.duel.modify.description,
  commandName: SLASH_COMMAND.duel.name,
  type: 'subcommand',
  builder: (subcommand) =>
    subcommand
      .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('User to modify')
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName('count')
          .setDescription('Number of duels')
          .setRequired(true)
          .setMinValue(0)
      )
      .addNumberOption((option) =>
        option
          .setName('exp')
          .setDescription('Exp gained')
          .setRequired(true)
          .setMinValue(0)
      ),
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    if (!interaction.guild) return;
    const user = interaction.options.getUser('user', true);
    const count = interaction.options.getNumber('count', true);
    const exp = interaction.options.getNumber('exp', true);
    const messageOptions = await commandHelper.duel.modifyLog({
      exp,
      count,
      client,
      user,
      server: interaction.guild,
      author: interaction.user,
      commandChannelId: interaction.channelId,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
