import {COMMAND_TYPE} from '../../../../constants/bot';
import {getUserSettingsEmbed} from '../../../../lib/embeds/getUserSettingsEmbed';
import {getUserAccount} from '../../../../models/user/user.service';
import {ActionRowBuilder, StringSelectMenuBuilder} from 'discord.js';
import sendInteractiveMessage from '../../../../lib/discord.js/message/sendInteractiveMessage';
import {getUserReminderChannelEmbed} from '../../../../lib/embeds/getUserReminderChannelEmbed';

export default <PrefixCommand>{
  name: 'settings',
  commands: ['settings', 's'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const userProfile = await getUserAccount(message.author.id);
    if (!userProfile) return;
    const userSettingsEmbed = getUserSettingsEmbed({
      client,
      author: message.author,
      userProfile,
    });
    const userReminderChannelEmbed = getUserReminderChannelEmbed({
      userProfile,
      author: message.author,
    });
    const event = await sendInteractiveMessage({
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
