import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {SLASH_COMMAND} from '../../constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {GUILD_SETTINGS_PAGE_TYPE} from '../../../../lib/epic-helper/command-helper/guild-settings/_showSettings';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.toggle.show.name,
  description: SLASH_COMMAND.guild.toggle.show.description,
  commandName: SLASH_COMMAND.guild.name,
  groupName: SLASH_COMMAND.guild.toggle.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip
  },
  execute: async (client, interaction) => {
    if (!interaction.inGuild()) return;

    const guildSettings = await commandHelper.guildSettings.showSettings({
      server: interaction.guild!,
      type: GUILD_SETTINGS_PAGE_TYPE.toggle
    });
    let event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: guildSettings.getMessagePayload(),
      interactive: true,
      onStop: () => {
        event = undefined;
      }
    });
    if (!event) return;
    event.every((interaction, customId) => {
      return guildSettings.replyInteraction({
        interaction,
        customId
      });
    });
  }
};
