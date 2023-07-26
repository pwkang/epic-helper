import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {SLASH_COMMAND_SERVER_NAME, SLASH_COMMAND_SERVER_TT_VERIFICATION_NAME} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'set-channel',
  description: 'Set the TT verification channel',
  type: 'subcommand',
  commandName: SLASH_COMMAND_SERVER_NAME,
  groupName: SLASH_COMMAND_SERVER_TT_VERIFICATION_NAME,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
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
