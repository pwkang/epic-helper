import _muteUser from './_mute-user';
import _unMuteUser from './_unmute-ser';
import _getChannel from './_get-channel';
import _isGuildChannel from './_is-guild-channel';

const djsChannelHelper = {
  muteUser: _muteUser,
  unMuteUser: _unMuteUser,
  getChannel: _getChannel,
  isGuildChannel: _isGuildChannel,
};

export default djsChannelHelper;
