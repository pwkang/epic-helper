import type {IServer} from '@epic-helper/models';
import {typedObjectEntries} from '@epic-helper/utils';
import {RPG_RANDOM_EVENTS} from '@epic-helper/constants';

export const toServer = (server: any): IServer => {
  return {
    serverId: server?.serverId,
    name: server?.name,
    settings: {
      admin: {
        rolesId: server?.settings?.admin?.rolesId ?? [],
        usersId: server?.settings?.admin?.usersId ?? []
      },
      enchant: {
        channels: server?.settings?.enchant?.channels ?? [],
        muteDuration: server?.settings?.enchant?.muteDuration
      },
      randomEvent: typedObjectEntries(RPG_RANDOM_EVENTS).reduce(
        (acc, [key, value]) => {
          acc[key] = server?.settings?.randomEvent?.[key] ?? value;
          return acc;
        },
        {} as Record<ValuesOf<typeof RPG_RANDOM_EVENTS>, string>
      ),
      ttVerification: {
        channelId: server?.settings?.ttVerification?.channelId,
        rules: server?.settings?.ttVerification?.rules ?? []
      }
    },
    toggle: {
      randomEvent: server?.toggle?.randomEvent,
      ttVerification: server?.toggle?.ttVerification,
      enchantMute: server?.toggle?.enchantMute
    },
    tokens: server?.tokens ?? []
  };
};

export const toServers = (servers: any): IServer[] => {
  return servers.map(toServer);
};
