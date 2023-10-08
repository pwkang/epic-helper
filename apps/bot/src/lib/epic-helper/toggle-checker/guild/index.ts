import {guildService} from '../../../../services/database/guild.service';
import {
  _guildEnabled,
  _toggleDuelLogDuelAdd,
  _toggleDuelLogDuelModify,
  _toggleDuelLogDuelReset,
  _toggleDuelLogDuelUndo,
  _toggleDuelRefRequired,
  _toggleUpgraidAllowReserved,
  _toggleUpgraidReminder,
  _toggleUpgraidSendUpgraidList
} from './toggle-guild-checker-list';

interface IToggleGuildChecker {
  serverId: string;
  roleId: string;
}

export const toggleGuildChecker = async ({
  roleId,
  serverId
}: IToggleGuildChecker) => {
  const guild = await guildService.findGuild({
    serverId,
    roleId
  });
  if (!guild) return null;

  return {
    enabled: _guildEnabled({toggle: guild.toggle}),
    upgraid: {
      reminder: _toggleUpgraidReminder({toggle: guild.toggle}),
      autoSendList: _toggleUpgraidSendUpgraidList({toggle: guild.toggle}),
      allowReserved: _toggleUpgraidAllowReserved({toggle: guild.toggle})
    },
    duel: {
      log: {
        duelAdd: _toggleDuelLogDuelAdd({toggle: guild.toggle}),
        duelUndo: _toggleDuelLogDuelUndo({toggle: guild.toggle}),
        duelReset: _toggleDuelLogDuelReset({toggle: guild.toggle}),
        duelModify: _toggleDuelLogDuelModify({toggle: guild.toggle})
      },
      refRequired: _toggleDuelRefRequired({toggle: guild.toggle})
    }
  };
};
