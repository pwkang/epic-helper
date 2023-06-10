import {IPetSubcommand} from '../pet.type';
import replyInteraction from '../../../../lib/discord.js/interaction/replyInteraction';
import generateFusionScoreEmbed from '../../../../lib/epic_helper/features/pets/petCalcFusionScore.lib';

export default async function petCalcFusionScore({client, interaction}: IPetSubcommand) {
  const petIds = interaction.options.getString('pet-id')?.split(' ') ?? [];

  const embeds = await generateFusionScoreEmbed({
    petIds,
    author: interaction.user,
  });

  replyInteraction({
    client,
    interaction,
    options: {
      embeds,
    },
  });
}
