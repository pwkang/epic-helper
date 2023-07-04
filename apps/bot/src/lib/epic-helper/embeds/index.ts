import getUserReminderChannelEmbed from './reminder-channel.embed';
import getUserSettingsEmbed from './user-settings.embed';
import getUserCooldownEmbed from './cooldown.embed';
import _howToRegisterEmbed from './how-to-register.embed';
import _successfullyRegisterEmbed from './successfully-register.embed';
import _turnOnAccount from './turn-on-account';

const embedProvider = {
  reminderChannel: getUserReminderChannelEmbed,
  userSettings: getUserSettingsEmbed,
  userCooldown: getUserCooldownEmbed,
  howToRegister: _howToRegisterEmbed,
  successfullyRegister: _successfullyRegisterEmbed,
  turnOnAccount: _turnOnAccount,
};

export default embedProvider;
