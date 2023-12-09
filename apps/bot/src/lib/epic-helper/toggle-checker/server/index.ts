import {serverService} from '@epic-helper/services';
import {_toggleEnchantMute, _toggleRandomEvent, _toggleTTVerification} from './toggle-server-checker-list';

interface IToggleServerChecker {
  serverId: string;
}

const toggleServerChecker = async ({serverId}: IToggleServerChecker) => {
  const serverAccount = await serverService.getServer({serverId});
  if (!serverAccount) return null;

  return {
    enchantMute: _toggleEnchantMute({toggle: serverAccount.toggle}),
    randomEvent: _toggleRandomEvent({toggle: serverAccount.toggle}),
    ttVerification: _toggleTTVerification({toggle: serverAccount.toggle}),
  };
};

export default toggleServerChecker;
