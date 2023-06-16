import getUserReminderChannelEmbed from './reminder-channel.embed';
import getUserSettingsEmbed from './user-settings.embed';
import getUserCooldownEmbed from './cooldown.embed';
import getEnchantChannelsEmbed from './enchant-channels.embed';
import {getToggleEmbed} from './toggle.embed';

const embedsList = {
  reminderChannel: getUserReminderChannelEmbed,
  userSettings: getUserSettingsEmbed,
  userCooldown: getUserCooldownEmbed,
  enchantChannels: getEnchantChannelsEmbed,
  toggle: getToggleEmbed,
};

export default embedsList;
