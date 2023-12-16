import type {BaseMessageOptions, User} from 'discord.js';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';
import {userReminderServices, userService, userStatsService} from '@epic-helper/services';
import {BOT_CLICKABLE_SLASH_COMMANDS, BOT_COLOR} from '@epic-helper/constants';

interface ISlashAccountDelete {
  author: User;
}

export const _deleteAccount = ({author}: ISlashAccountDelete) => {
  function render(): BaseMessageOptions {
    return {
      embeds: [embed],
      components: [actionRow],
    };
  }

  async function responseInteraction(
    customId: string,
  ): Promise<BaseMessageOptions> {
    if (customId === 'confirm') {
      await userService.userAccountDelete(author.id);
      await userReminderServices.clearUserCooldowns(author.id);
      await userStatsService.clearUserStats({userId: author.id});
      return {
        components: [],
        embeds: [deletedEmbed],
      };
    } else {
      return {
        components: [],
        embeds: [cancelledEmbed],
      };
    }
  }

  return {
    render,
    responseInteraction,
  };
};

const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId('confirm')
    .setLabel('Confirm')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId('cancel')
    .setLabel('Cancel')
    .setStyle(ButtonStyle.Secondary),
);

const embed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setTitle('Are you sure you want to delete your account?')
  .setDescription(
    'The following information will be deleted:\n' +
    '- Account information\n' +
    '- Pets\n' +
    '- Commands Stats\n' +
    '- Reminders\n' +
    '- All settings\n' +
    '\n' +
    'Except for the following:\n' +
    '- Guild upgrade/raid logs\n' +
    '- Guild duel logs\n',
  );

const deletedEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setTitle('Successfully deleted your account!')
  .setDescription(
    `You can create a new account by using ${BOT_CLICKABLE_SLASH_COMMANDS.accountRegister} again`,
  );

const cancelledEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('You have cancelled your account deletion');
