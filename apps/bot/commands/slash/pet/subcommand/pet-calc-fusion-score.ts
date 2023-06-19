import {IPetSubcommand} from '../pet.type';
import generateFusionScoreEmbed from '../../../../lib/epic-helper/features/pets/pet-calc-fusion-score';
import djsInteractionHelper from '../../../../lib/discord.js/interaction';

export default async function petCalcFusionScore({client, interaction}: IPetSubcommand) {
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
}
