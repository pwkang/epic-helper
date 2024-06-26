import getUserCooldownEmbed from './cooldown.embed';
import _howToRegisterEmbed from './how-to-register.embed';
import _turnOnAccount from './turn-on-account';
import _profileBackgroundNotSupported from './profile-background-not-supported';
import {_notInGuild} from './not-in-guild';
import _donorOnly from './donor-only';

const embedProvider = {
  userCooldown: getUserCooldownEmbed,
  howToRegister: _howToRegisterEmbed,
  turnOnAccount: _turnOnAccount,
  profileBackgroundNotSupported: _profileBackgroundNotSupported,
  notInGuild: _notInGuild,
  donorOnly: _donorOnly,
};

export default embedProvider;
