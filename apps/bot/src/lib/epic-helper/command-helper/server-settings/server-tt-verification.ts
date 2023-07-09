import {BaseMessageOptions, Guild} from 'discord.js';
import {serverService} from '../../../../services/database/server.service';
import {_getTTVerificationSettingsEmbed} from './embed/tt-verification.embed';

interface ITTVerificationSettings {
  server: Guild;
}

interface ISetChannel {
  channelId: string;
}

interface IAddRule {
  roleId: string;
  minTT: number;
  maxTT?: number;
}

interface IRemoveRule {
  roleId: string;
}

export const _ttVerificationSettings = async ({server}: ITTVerificationSettings) => {
  let serverAccount = await serverService.getServer({
    serverId: server.id,
  });
  if (!serverAccount) return null;

  const render = (): BaseMessageOptions => {
    return {
      embeds: [
        _getTTVerificationSettingsEmbed({
          serverAccount,
          guild: server,
        }),
      ],
    };
  };

  const setChannel = async ({channelId}: ISetChannel): Promise<BaseMessageOptions> => {
    serverAccount = await serverService.setTTVerificationChannel({
      channelId,
      serverId: server.id,
    });
    return render();
  };

  const setRule = async ({minTT, maxTT, roleId}: IAddRule) => {
    serverAccount = await serverService.setTTVerificationRule({
      roleId,
      serverId: server.id,
      maxTT,
      minTT,
    });
    return render();
  };

  const removeRule = async ({roleId}: IRemoveRule) => {
    serverAccount = await serverService.removeTTVerificationRule({
      roleId,
      serverId: server.id,
    });
    return render();
  };

  return {
    setChannel,
    setRule,
    removeRule,
  };
};
