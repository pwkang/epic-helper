import {
  ActionRowBuilder,
  BaseMessageOptions,
  Client,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  User,
} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import embedProvider from '../../embeds';

interface IAccountSettings {
  author: User;
}

interface IRender {
  type: ValuesOf<typeof PAGE_TYPE>;
}

export const _accountSettings = async ({author}: IAccountSettings) => {
  const userProfile = await userService.getUserAccount(author.id);
  if (!userProfile) return null;
  const userSettingsEmbed = embedProvider.userSettings({
    author,
    userProfile,
  });
  const userReminderChannelEmbed = embedProvider.reminderChannel({
    userProfile,
    author,
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
    }
  }

  function responseInteraction(interaction: StringSelectMenuInteraction): BaseMessageOptions {
    const selected = interaction.values[0] as ValuesOf<typeof PAGE_TYPE>;
    switch (selected) {
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
    }
  }

  return {
    render,
    responseInteraction,
  };
};

const PAGE_TYPE = {
  settings: 'settings',
  reminderChannel: 'reminder_channel',
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
        }
      )
  );
};
