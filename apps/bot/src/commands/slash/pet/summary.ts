import {SLASH_COMMAND} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.pet.summary.name,
  commandName: SLASH_COMMAND.pet.name,
  type: 'subcommand',
  description: SLASH_COMMAND.pet.summary.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    donorOnly: true,
  },
  builder: (subcommand) =>
    subcommand.addStringOption((option) =>
      option
        .setName('filter')
        .setDescription('Select filter')
        .addChoices(
          {name: 'Tier', value: 'tier'},
          {name: 'Skill', value: 'skill'},
        )
        .setRequired(true),
    ),
  execute: async (client, interaction) => {
    const filter = interaction.options.getString('filter', true) as
      | 'tier'
      | 'skill';
    const petSummary = await commandHelper.pet.summary({
      author: interaction.user,
      type: filter,
    });
    if (!petSummary) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: petSummary.render(),
    });
  },
};
