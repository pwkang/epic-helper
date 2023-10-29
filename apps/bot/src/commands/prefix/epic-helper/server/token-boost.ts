import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../../lib/epic-helper/command-helper/server-settings/constant';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'tokenBoosts',
  commands: ['server token boost', 'stb'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {},
  execute: async (client, message) => {
    if (!message.inGuild()) return;
    const serverSettings = await commandHelper.serverSettings.settings({
      server: message.guild,
      client,
    });
    if (!serverSettings) return;
    const messageOptions = serverSettings.render({
      type: SERVER_SETTINGS_PAGE_TYPE.tokenBoosts,
    });
    let event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: messageOptions,
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
