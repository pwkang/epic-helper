import type {Guild} from 'discord.js';
import type {IServer} from '@epic-helper/models';
import {toggleDisplayList} from '../toggle.list';
import {renderEmbed} from '../toggle.embed';
import type {IUpdateToggle} from '../toggle.helper';
import {getUpdateQuery} from '../toggle.helper';
import {serverService} from '@epic-helper/services';

interface IGetServerToggle {
  server: Guild;
}

export const getServerToggle = async ({server}: IGetServerToggle) => {
  const serverAccount = await serverService.getServer({
    serverId: server.id,
  });
  if (!serverAccount) return null;

  const render = (serverAccount: IServer) => {
    const embed = getServerToggleEmbed({
      server,
      serverAccount,
    });
    return {
      embeds: [embed],
    };
  };

  const update = async ({on, off}: IUpdateToggle) => {
    const updateQuery = getUpdateQuery<IServer>({
      on,
      off,
      toggleInfo: toggleDisplayList.server(serverAccount.toggle),
    });
    const updatedServer = await serverService.updateServerToggle({
      serverId: server.id,
      query: updateQuery,
    });
    if (!updatedServer) return null;
    return render(updatedServer);
  };

  const reset = async () => {
    const updatedServer = await serverService.resetServerToggle({
      serverId: server.id,
    });
    if (!updatedServer) return null;
    return render(updatedServer);
  };

  return {
    render: () => render(serverAccount),
    update,
    reset,
  };
};

interface IGetServerToggleEmbed {
  serverAccount: IServer;
  server: Guild;
}

const getServerToggleEmbed = ({
  serverAccount,
  server,
}: IGetServerToggleEmbed) => {
  return renderEmbed({
    embedsInfo: toggleDisplayList.server(serverAccount.toggle),
  }).setAuthor({
    name: `${server.name} Toggle Settings`,
  });
};
