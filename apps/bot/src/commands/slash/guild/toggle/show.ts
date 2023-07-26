import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {GUILD_SETTINGS_PAGE_TYPE} from '../../../../lib/epic-helper/command-helper/guild-settings/_showSettings';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND_GUILD_NAME, SLASH_COMMAND_GUILD_TOGGLE_NAME} from '../constant';

export default <SlashCommand>{
  name: 'show',
  description: 'Show guild features',
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  commandName: SLASH_COMMAND_GUILD_NAME,
  groupName: SLASH_COMMAND_GUILD_TOGGLE_NAME,
  execute: async (client, interaction) => {
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
  },
};
