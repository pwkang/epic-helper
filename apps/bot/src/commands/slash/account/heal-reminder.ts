import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {userService} from '../../../services/database/user.service';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.account.healReminder.name,
  description: SLASH_COMMAND.account.healReminder.description,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  commandName: SLASH_COMMAND.account.name,
  builder: (subcommand) =>
    subcommand
      .addNumberOption((input) =>
        input.setName('hp').setDescription('Target HP to heal').setMinValue(1),
      )
      .addBooleanOption((option) =>
        option
          .setName('remove')
          .setDescription('Remove and disable heal reminder'),
      ),
  execute: async (client, interaction) => {
    const userId = interaction.user.id;
    const toRemove = interaction.options.getBoolean('remove');
    const hp = interaction.options.getNumber('hp');

    let message;
    if (toRemove) {
      await userService.removeUserHealReminder({
        userId,
      });
      message = 'Heal reminder removed';
    } else if (hp) {
      await userService.setUserHealReminder({
        userId,
        hp,
      });
      message = `Heal reminder set to ${hp}`;
    } else {
      message = 'Please provide a valid HP target';
    }

    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: {
        content: message,
      },
    });
  },
};
