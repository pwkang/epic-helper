import {ActionRowBuilder, BaseMessageOptions, ButtonBuilder, ButtonStyle, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {userPetServices} from '../../../../services/database/user-pet.service';
import {userStatsService} from '../../../../services/database/user-stats.service';

interface ISlashAccountDelete {
  author: User;
}

export const _deleteAccount = ({author}: ISlashAccountDelete) => {
  function render(): BaseMessageOptions {
    return {
      content: 'Are you sure you want to delete your account?',
      components: [actionRow],
    };
  }

  async function responseInteraction(customId: string): Promise<BaseMessageOptions> {
    if (customId === 'confirm') {
      await userService.userAccountDelete(author.id);
      await userReminderServices.clearUserCooldowns(author.id);
      await userPetServices.clearUserPets({
        userId: author.id,
      });
      await userStatsService.clearUserStats({userId: author.id});
      return {
        content: `Successfully deleted your account!`,
        components: [],
      };
    } else {
      return {
        content: 'You have cancelled your account deletion',
        components: [],
      };
    }
  }

  return {
    render,
    responseInteraction,
  };
};

const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder().setCustomId('confirm').setLabel('Confirm').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
);
