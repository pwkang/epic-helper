import getUserReminderChannelEmbed from './reminder-channel.embed';
import getUserSettingsEmbed from './user-settings.embed';
import getUserCooldownEmbed from './cooldown.embed';
import _howToRegisterEmbed from './how-to-register.embed';
import _turnOnAccount from './turn-on-account';
import _profileBackgroundNotSupported from './profile-background-not-supported';

const embedProvider = {
  reminderChannel: getUserReminderChannelEmbed,
  userSettings: getUserSettingsEmbed,
  userCooldown: getUserCooldownEmbed,
  howToRegister: _howToRegisterEmbed,
  turnOnAccount: _turnOnAccount,
  profileBackgroundNotSupported: _profileBackgroundNotSupported,
};

export default embedProvider;
