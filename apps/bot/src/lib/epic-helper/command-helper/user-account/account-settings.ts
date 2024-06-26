import type {BaseMessageOptions, StringSelectMenuInteraction, User} from 'discord.js';
import {ActionRowBuilder, StringSelectMenuBuilder} from 'discord.js';
import {
  donorService,
  freeDonorService,
  guildService,
  redisServerInfo,
  serverService,
  userService,
} from '@epic-helper/services';
import {_getUserSettingsEmbed} from './embeds/user-settings.embed';
import {_getUserReminderChannelEmbed} from './embeds/reminder-channels.embed';
import {_getDonorInfoEmbed} from './embeds/donor-info.embed';
import type {ValuesOf} from '@epic-helper/types';

interface IAccountSettings {
  author: User;
}

interface IRender {
  type: ValuesOf<typeof PAGE_TYPE>;
}

export const _accountSettings = async ({author}: IAccountSettings) => {
  const userProfile = await userService.getUserAccount(author.id);
  if (!userProfile) return null;
  const donor = await donorService.findDonor({
    discordUserId: author.id,
  });
  const freeDonor = await freeDonorService.findFreeDonor({
    discordUserId: author.id,
  });
  const boostedServers = await serverService.getUserBoostedServers({
    userId: author.id,
  });
  const guild = await guildService.findUserGuild({
    userId: author.id,
  });
  const guildServer = guild
    ? await redisServerInfo.getServerInfo({serverId: guild?.serverId})
    : null;
  const userSettingsEmbed = _getUserSettingsEmbed({
    author,
    userProfile,
    guildName: guild?.info.name,
    guildServerName: guildServer?.name,
  });
  const userReminderChannelEmbed = _getUserReminderChannelEmbed({
    userProfile,
    author,
  });
  const donorInfoEmbed = _getDonorInfoEmbed({
    author,
    donor,
    freeDonor,
    boostedServers,
  });

  function render({type}: IRender) {
    switch (type) {
      case PAGE_TYPE.settings:
        return {
          embeds: [userSettingsEmbed],
          components: [getActionRow({selected: PAGE_TYPE.settings})],
        };
      case PAGE_TYPE.reminderChannel:
        return {
          embeds: [userReminderChannelEmbed],
          components: [getActionRow({selected: PAGE_TYPE.reminderChannel})],
        };
      case PAGE_TYPE.donorInfo:
        return {
          embeds: [donorInfoEmbed],
          components: [getActionRow({selected: PAGE_TYPE.donorInfo})],
        };
    }
  }

  function responseInteraction(
    interaction: StringSelectMenuInteraction,
  ): BaseMessageOptions {
    const selected = interaction.values[0] as ValuesOf<typeof PAGE_TYPE>;
    return render({type: selected});
  }

  return {
    render,
    responseInteraction,
  };
};

const PAGE_TYPE = {
  settings: 'settings',
  reminderChannel: 'reminder_channel',
  donorInfo: 'donor_info',
} as const;

interface IGetActionRow {
  selected: ValuesOf<typeof PAGE_TYPE>;
}

const getActionRow = ({selected}: IGetActionRow) => {
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cmd_type')
      .setPlaceholder('Select a command')
      .setOptions(
        {
          label: 'Settings',
          value: 'settings',
          default: selected === PAGE_TYPE.settings,
        },
        {
          label: 'Reminder Channel',
          value: 'reminder_channel',
          default: selected === PAGE_TYPE.reminderChannel,
        },
        {
          label: 'Donor Info',
          value: 'donor_info',
          default: selected === PAGE_TYPE.donorInfo,
        },
      ),
  );
};
