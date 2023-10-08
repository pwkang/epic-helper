import djsInteractionHelper from '../../../lib/discordjs/interaction';
import commandHelper from '../../../lib/epic-helper/command-helper';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../lib/epic-helper/command-helper/server-settings/constant';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.settings.name,
  description: SLASH_COMMAND.server.settings.description,
  commandName: SLASH_COMMAND.server.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true,
  },
  execute: async (client, interaction) => {
    if (!interaction.inGuild() || !interaction.guild) return;
    const serverSettings = await commandHelper.serverSettings.settings({
      server: interaction.guild,
    });
    if (!serverSettings) return;
    const messageOptions = serverSettings.render({
      type: SERVER_SETTINGS_PAGE_TYPE.randomEvent,
    });
    let event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
      interactive: true,
      onStop: () => {
        event = undefined;
      },
    });
    if (!event) return;
    event.every((interaction) => {
      if (!interaction.isStringSelectMenu()) return null;
      return serverSettings.responseInteraction(interaction);
    });
  },
};
