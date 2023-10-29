import type {IGetUserBoostedServersResponse} from '../database/server.service';

export const toUserBoostedServers = (
  userBoostedServers: IGetUserBoostedServersResponse[],
): IGetUserBoostedServersResponse[] => {
  return userBoostedServers.map((userBoostedServer) => {
    return {
      serverId: String(userBoostedServer.serverId),
      token: userBoostedServer.token,
      name: userBoostedServer.name,
    };
  });
};
