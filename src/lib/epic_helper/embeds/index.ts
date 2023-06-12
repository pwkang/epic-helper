import getUserReminderChannelEmbed from './reminderChannel.embed';
import getUserSettingsEmbed from './userSettings.embed';
import getUserCooldownEmbed from './cooldown.embed';

const embedsList = {
  reminderChannel: getUserReminderChannelEmbed,
  userSettings: getUserSettingsEmbed,
  userCooldown: getUserCooldownEmbed,
};

export default embedsList;
