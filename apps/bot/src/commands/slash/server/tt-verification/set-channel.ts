import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.ttVerification.setChannel.name,
  description: SLASH_COMMAND.server.ttVerification.setChannel.description,
  commandName: SLASH_COMMAND.server.name,
  groupName: SLASH_COMMAND.server.ttVerification.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true,
  },
  builder: (subcommand) =>
    subcommand.addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Channel to set as TT verification channel')
        .setRequired(true)
    ),
  execute: async (client, interaction) => {
    if (!interaction.inGuild() || !interaction.guild) return;
    const channel = interaction.options.getChannel('channel', true);
    const ttVerification = await commandHelper.serverSettings.ttVerification({
      server: interaction.guild,
    });
    if (!ttVerification) return;
    const messageOptions = await ttVerification.setChannel({
      channelId: channel.id,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
