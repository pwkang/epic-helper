import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from './constant';
import commandHelper from '../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.help.name,
  description: SLASH_COMMAND.help.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  type: 'command',
  builder: (builder) =>
    builder.addStringOption(option =>
      option.setName('search')
        .setDescription('Search for a command')
        .setRequired(false),
    ),
  execute: async (client, interaction) => {
    const search = interaction.options.getString('search') ?? undefined;
    const messageOptions = await commandHelper.information.help({
      client,
      search,
    });
    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      options: messageOptions,
      interaction,
    });
  },
};
