import type {IServerToggle} from '@epic-helper/models';

interface IToggleServerCheckerItem {
  toggle: IServerToggle;
}

export const _toggleEnchantMute = ({toggle}: IToggleServerCheckerItem) =>
  toggle.enchantMute;

export const _toggleRandomEvent = ({toggle}: IToggleServerCheckerItem) =>
  toggle.randomEvent;

export const _toggleTTVerification = ({toggle}: IToggleServerCheckerItem) =>
  toggle.ttVerification;
