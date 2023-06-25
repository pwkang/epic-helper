import {IGuildSubCommand} from './type';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {guildService} from '../../../../services/database/guild.service';

export const viewGuildSettings = async ({client, interaction}: IGuildSubCommand) => {
  const guilds = await guildService.getAllGuilds({
    serverId: interaction.guildId!,
  });
  let selectedGuildRoleId: string | undefined = undefined;
  let page = 0;
  const event = await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: await commandHelper.guildSettings.getMessagePayload({
      server: interaction.guild!,
      guilds,
      page,
    }),
    interactive: true,
  });
  if (!event) return;
  event.on('first', (interaction) => {
    page = 0;
    return commandHelper.guildSettings.getMessagePayload({
      server: interaction.guild!,
      guilds,
      page,
      guildRoleId: selectedGuildRoleId,
    });
  });
  event.on('prev', (interaction) => {
    page--;
    return commandHelper.guildSettings.getMessagePayload({
      server: interaction.guild!,
      guilds,
      page,
      guildRoleId: selectedGuildRoleId,
    });
  });
  event.on('next', (interaction) => {
    page++;
    return commandHelper.guildSettings.getMessagePayload({
      server: interaction.guild!,
      guilds,
      page,
      guildRoleId: selectedGuildRoleId,
    });
  });
  event.on('last', (interaction) => {
    page = Math.floor(guilds.length / commandHelper.guildSettings.ITEMS_PER_PAGE);
    return commandHelper.guildSettings.getMessagePayload({
      server: interaction.guild!,
      guilds,
      page,
      guildRoleId: selectedGuildRoleId,
    });
  });
  event.on(commandHelper.guildSettings.GUILD_SELECTOR_NAME, (interaction) => {
    if (!interaction.isStringSelectMenu()) return null;
    const guildId = interaction.values[0];
    selectedGuildRoleId = guildId;
    return commandHelper.guildSettings.getMessagePayload({
      server: interaction.guild!,
      guilds,
      page,
      guildRoleId: guildId,
    });
  });
};
