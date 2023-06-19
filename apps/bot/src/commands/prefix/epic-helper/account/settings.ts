import embedsList from '../../../../lib/epic-helper/embeds';
import {djsMessageHelper} from '../../../../lib/discord.js/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {userService} from '@epic-helper/models';
import {ActionRowBuilder, StringSelectMenuBuilder} from 'discord.js';

export default <PrefixCommand>{
  name: 'settings',
  commands: ['settings', 's'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const userProfile = await userService.getUserAccount(message.author.id);
    if (!userProfile) return;
    const userSettingsEmbed = embedsList.userSettings({
      client,
      author: message.author,
      userProfile,
    });
    const userReminderChannelEmbed = embedsList.reminderChannel({
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
