import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {serverService} from '../../../../services/database/server.service';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {IServerConfig} from './type';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../../lib/epic-helper/command-helper/server-settings/constant';

export const setEnchantMuteDuration = async ({client, interaction}: IServerConfig) => {
  if (!interaction.inGuild()) return;
  const duration = interaction.options.getNumber('duration')!;

  await serverService.updateEnchantMuteDuration({
    duration: duration * 1000,
    serverId: interaction.guildId!,
  });

  const serverSettings = await commandHelper.serverSettings.settings({
    server: interaction.guild!,
  });
  if (!serverSettings) return;
  await djsInteractionHelper.replyInteraction({
    client,
    options: serverSettings.render({
      type: SERVER_SETTINGS_PAGE_TYPE.enchantMute,
      displayOnly: true,
    }),
    interaction,
  });
};
