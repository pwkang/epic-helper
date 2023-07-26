import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {SLASH_COMMAND_TOGGLE_NAME} from './constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'set',
  description: 'Update personal toggle settings',
  type: 'subcommand',
  commandName: SLASH_COMMAND_TOGGLE_NAME,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  builder: (subcommand) =>
    subcommand
      .addStringOption((option) =>
        option.setName('on').setDescription('Type the ID of the settings. e.g. a1 b2a')
      )
      .addStringOption((option) =>
        option.setName('off').setDescription('Type the ID of the settings. e.g. a1 b2a')
      ),
  execute: async (client, interaction) => {
    const onStr = interaction.options.getString('on');
    const offStr = interaction.options.getString('off');
    const userToggle = await commandHelper.toggle.user({
      author: interaction.user,
    });
    if (!userToggle) return;
    const messageOptions = await userToggle.update({
      on: onStr ?? undefined,
      off: offStr ?? undefined,
    });
    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
