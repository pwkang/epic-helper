import getUserReminderChannelEmbed from './reminder-channel.embed';
import getUserSettingsEmbed from './user-settings.embed';
import getUserCooldownEmbed from './cooldown.embed';

const embedsList = {
  reminderChannel: getUserReminderChannelEmbed,
  userSettings: getUserSettingsEmbed,
  userCooldown: getUserCooldownEmbed,
};

export default embedsList;
