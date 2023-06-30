import {_getUserGuildRoles} from './_get-user-guild-roles';
import {_renderMultipleGuildEmbed} from './embed/multiple-guild';
import {_renderThisWeekUpgraidListEmbed} from './embed/this-week-upgraid-list';
import {_sendRecordsToGuildChannel} from './_send-records-to-guild-channel';

export const _guildHelper = {
  getUserGuildRoles: _getUserGuildRoles,
  renderMultipleGuildEmbed: _renderMultipleGuildEmbed,
  renderThisWeekUpgraidList: _renderThisWeekUpgraidListEmbed,
  sendRecordsToGuildChannel: _sendRecordsToGuildChannel,
};
