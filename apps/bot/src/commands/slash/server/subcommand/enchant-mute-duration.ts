import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {serverService} from '../../../../services/database/server.service';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {IServerConfig} from './type';

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
  const embed = commandHelper.serverSettings.renderEnchantMuteEmbed({
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
