import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {userPetServices} from '../../../../services/database/user-pet.service';
import {userStatsService} from '../../../../services/database/user-stats.service';

export default <PrefixCommand>{
  name: 'accountDelete',
  commands: ['delete'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, message) => {
    const userExists = await userService.isUserAccountExist(message.author.id);
    if (!userExists) {
      return djsMessageHelper.reply({
        client,
        options: `You have not registered yet!`,
        message,
      });
    }

    const event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: {
        content: `Are you sure you want to delete your account?`,
        components: [row],
      },
    });
    if (!event) return;

    event.on('confirm', async () => {
      await userService.userAccountDelete(message.author.id);
      await userReminderServices.clearUserCooldowns(message.author.id);
      await userPetServices.clearUserPets({
        userId: message.author.id,
      });
      await userStatsService.clearUserStats({userId: message.author.id});
      event.stop();
      return {
        content: `Successfully deleted your account!`,
        components: [],
      };
    });
    event.on('cancel', () => {
      event.stop();
      return {
        content: `Successfully canceled!`,
        components: [],
      };
    });
  },
};

const confirm = new ButtonBuilder()
  .setCustomId('confirm')
  .setLabel('Confirm')
  .setStyle(ButtonStyle.Primary);
const cancel = new ButtonBuilder()
  .setCustomId('cancel')
  .setLabel('Cancel')
  .setStyle(ButtonStyle.Secondary);
const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm, cancel);
