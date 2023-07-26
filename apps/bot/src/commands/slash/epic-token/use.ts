import djsInteractionHelper from '../../../lib/discordjs/interaction';
import commandHelper from '../../../lib/epic-helper/command-helper';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND_EPIC_TOKEN_NAME} from './constant';

export default <SlashCommand>{
  name: 'use',
  description: 'Use your epic token on this server',
  commandName: SLASH_COMMAND_EPIC_TOKEN_NAME,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  builder: (subcommand) =>
    subcommand.addNumberOption((option) =>
      option
        .setName('token')
        .setDescription('The token to use on this server')
        .setRequired(true)
        .setMinValue(1)
    ),
  type: 'subcommand',
  execute: async (client, interaction) => {
    if (!interaction.guildId) return;
    const token = interaction.options.getNumber('token', true);
    const messageOptions = await commandHelper.epicToken.useEpicToken({
      serverId: interaction.guildId,
      token,
      userId: interaction.user.id,
    });
    await djsInteractionHelper.replyInteraction({
      interaction,
      options: messageOptions,
      client,
    });
  },
};
