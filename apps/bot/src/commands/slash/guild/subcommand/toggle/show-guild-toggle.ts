import {IGuildSubCommand} from '../type';
import djsInteractionHelper from '../../../../../lib/discordjs/interaction';
import commandHelper from '../../../../../lib/epic-helper/command-helper';
import {GUILD_SETTINGS_PAGE_TYPE} from '../../../../../lib/epic-helper/command-helper/guild-settings/_showSettings';

export const showGuildToggle = async ({client, interaction}: IGuildSubCommand) => {
  if (!interaction.inGuild()) return;

  const guildSettings = await commandHelper.guildSettings.showSettings({
    server: interaction.guild!,
    type: GUILD_SETTINGS_PAGE_TYPE.toggle,
  });
  const event = await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: guildSettings.getMessagePayload(),
    interactive: true,
  });
  if (!event) return;
  event.every((interaction, customId) => {
    return guildSettings.replyInteraction({
      interaction,
      customId,
    });
  });
};
