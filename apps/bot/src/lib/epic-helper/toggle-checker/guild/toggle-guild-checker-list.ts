import {IGuildToggle} from '@epic-helper/models';

interface IToggleGuildCheckerItem {
  toggle: IGuildToggle;
}

export const _guildEnabled = ({toggle}: IToggleGuildCheckerItem) => toggle.onOff;

export const _toggleUpgraidReminder = ({toggle}: IToggleGuildCheckerItem) =>
  toggle.onOff && toggle.upgraid.reminder;

export const _toggleUpgraidSendUpgraidList = ({toggle}: IToggleGuildCheckerItem) =>
  toggle.onOff && toggle.upgraid.sendUpgraidList;

export const _toggleUpgraidAllowReserved = ({toggle}: IToggleGuildCheckerItem) =>
  toggle.onOff && toggle.upgraid.allowReserved;

export const _toggleDuelLogDuelAdd = ({toggle}: IToggleGuildCheckerItem) =>
  toggle.onOff && toggle.duel.log.all && toggle.duel.log.duelAdd;

export const _toggleDuelLogDuelUndo = ({toggle}: IToggleGuildCheckerItem) =>
  toggle.onOff && toggle.duel.log.all && toggle.duel.log.duelUndo;

export const _toggleDuelLogDuelReset = ({toggle}: IToggleGuildCheckerItem) =>
  toggle.onOff && toggle.duel.log.all && toggle.duel.log.duelReset;

export const _toggleDuelLogDuelModify = ({toggle}: IToggleGuildCheckerItem) =>
  toggle.onOff && toggle.duel.log.all && toggle.duel.log.duelModify;

export const _toggleDuelRefRequired = ({toggle}: IToggleGuildCheckerItem) =>
  toggle.onOff && toggle.duel.refRequired;
