import {IServerConfig} from '../config.type';
import serverService from '../../../../../models/server/server.service';
import djsInteractionHelper from '../../../../../lib/discord.js/interaction';
import embedsList from '../../../../../lib/epic-helper/embeds';

export const setEnchantMuteDuration = async ({client, interaction}: IServerConfig) => {
  if (!interaction.inGuild()) return;
  const duration = interaction.options.getNumber('duration')!;

  await serverService.updateEnchantMuteDuration({
    duration: duration * 1000,
    serverId: interaction.guildId!,
  });
  const serverProfile = await serverService.getServer({
    serverId: interaction.guildId!,
  });
  const embed = embedsList.enchantChannels({
    enchantSettings: serverProfile!.settings.enchant,
    guild: interaction.guild!,
  });
  await djsInteractionHelper.replyInteraction({
    client,
    options: {
      embeds: [embed],
    },
    interaction,
  });
};
