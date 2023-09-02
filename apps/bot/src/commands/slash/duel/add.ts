import {SLASH_COMMAND} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import messageFormatter from '../../../lib/discordjs/message-formatter';

export default <SlashCommand>{
  name: SLASH_COMMAND.duel.add.name,
  description: SLASH_COMMAND.duel.add.description,
  commandName: SLASH_COMMAND.duel.name,
  type: 'subcommand',
  builder: (subcommand) =>
    subcommand
      .addNumberOption((option) =>
        option
          .setName('exp')
          .setDescription('Exp Gained')
          .setRequired(true)
          .addChoices(
            {name: '0', value: 0},
            {name: '1', value: 1},
            {name: '2', value: 2},
            {name: '3', value: 3}
          )
      )
      .addStringOption((option) =>
        option.setName('link').setDescription('Message link to the duel result')
      )
      .addStringOption((option) =>
        option
          .setName('result')
          .setDescription('Duel result')
          .addChoices({name: 'win', value: 'win'}, {name: 'lose', value: 'lose'})
      ),
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    const exp = interaction.options.getNumber('exp', true);
    const link = interaction.options.getString('link');
    const result = interaction.options.getString('result');
    const messageSource = link ? messageFormatter.getInfoFromMessageUrl(link) : null;
    const embed = await commandHelper.duel.manualAdd({
      client,
      expGained: exp,
      hasWon: result === 'win',
      user: interaction.user,
      source: messageSource ?? undefined,
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
