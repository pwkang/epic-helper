import embedProvider from '../../../../lib/epic-helper/embeds';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {ActionRowBuilder, StringSelectMenuBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';

export default <PrefixCommand>{
  name: 'settings',
  commands: ['settings', 's'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, message) => {
    const userProfile = await userService.getUserAccount(message.author.id);
    if (!userProfile) return;
    const userSettingsEmbed = embedProvider.userSettings({
      client,
      author: message.author,
      userProfile,
    });
    const userReminderChannelEmbed = embedProvider.reminderChannel({
      userProfile,
      author: message.author,
    });
    const event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: {
        embeds: [userSettingsEmbed],
        components: [row],
      },
    });
    if (!event) return;
    event.on('cmd_type', (interaction) => {
      if (!interaction.isStringSelectMenu()) return null;
      const selected = interaction.values[0];
      switch (selected) {
        case 'settings':
          return {
            embeds: [userSettingsEmbed],
          };
        case 'reminder_channel':
          return {
            embeds: [userReminderChannelEmbed],
          };
      }
      return null;
    });
  },
};

const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId('cmd_type')
    .setPlaceholder('Select a command')
    .setOptions(
      {
        label: 'Settings',
        value: 'settings',
      },
      {
        label: 'Reminder Channel',
        value: 'reminder_channel',
      }
    )
);
