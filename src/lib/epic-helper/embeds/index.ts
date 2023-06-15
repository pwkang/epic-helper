import getUserReminderChannelEmbed from './reminder-channel.embed';
import getUserSettingsEmbed from './user-settings.embed';
import getUserCooldownEmbed from './cooldown.embed';
import getEnchantChannelsEmbed from './enchant-channels.embed';

const embedsList = {
  reminderChannel: getUserReminderChannelEmbed,
  userSettings: getUserSettingsEmbed,
  userCooldown: getUserCooldownEmbed,
  enchantChannels: getEnchantChannelsEmbed,
};

export default embedsList;
