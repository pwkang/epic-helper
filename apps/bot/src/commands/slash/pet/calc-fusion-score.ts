import generateFusionScoreEmbed from '../../../lib/epic-helper/features/pets/pet-calc-fusion-score';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.pet.calcFusionScore.name,
  description: SLASH_COMMAND.pet.calcFusionScore.description,
  commandName: SLASH_COMMAND.pet.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  builder: (subcommand) =>
    subcommand.addStringOption((option) =>
      option
        .setName('pet-id')
        .setDescription('ID of the pet, separate multiple pets with space')
        .setRequired(true),
    ),
  execute: async (client, interaction) => {
    const petIds = interaction.options.getString('pet-id')?.split(' ') ?? [];

    const embeds = await generateFusionScoreEmbed({
      petIds,
      author: interaction.user,
    });

    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: {
        embeds,
      },
    });
  },
};
