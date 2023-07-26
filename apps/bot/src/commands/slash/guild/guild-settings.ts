import djsInteractionHelper from '../../../lib/discordjs/interaction';
import commandHelper from '../../../lib/epic-helper/command-helper';
import {GUILD_SETTINGS_PAGE_TYPE} from '../../../lib/epic-helper/command-helper/guild-settings/_showSettings';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND_GUILD_NAME} from './constant';

export default <SlashCommand>{
  name: 'settings',
  description: 'Show guild settings',
  type: 'subcommand',
  commandName: SLASH_COMMAND_GUILD_NAME,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    const guildSettings = await commandHelper.guildSettings.showSettings({
      server: interaction.guild!,
      type: GUILD_SETTINGS_PAGE_TYPE.settings,
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
