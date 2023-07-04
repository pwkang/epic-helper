import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import CommandHelper from '../../../../lib/epic-helper/command-helper';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../../lib/epic-helper/command-helper/server-settings/constant';
import {serverService} from '../../../../services/database/server.service';
import {IServerConfig} from './type';

export const viewServerSettings = async ({client, interaction}: IServerConfig) => {
  if (!interaction.inGuild() || !interaction.guild) return;
  const serverAccount = await serverService.getServer({
    serverId: interaction.guildId,
  });
  if (!serverAccount) return;
  const event = await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: commandHelper.serverSettings.getMessagePayload({
      serverAccount,
      guild: interaction.guild,
    }),
    interactive: true,
  });
  if (!event) return;
  event.on(CommandHelper.serverSettings.SERVER_SETTINGS_SELECT_MENU_ID, async (interaction) => {
    if (!interaction.isStringSelectMenu()) return null;
    const pageType = interaction.values[0] as ValuesOf<typeof SERVER_SETTINGS_PAGE_TYPE>;

    return commandHelper.serverSettings.getMessagePayload({
      guild: interaction.guild!,
      pageType,
      serverAccount,
    });
  });
};
