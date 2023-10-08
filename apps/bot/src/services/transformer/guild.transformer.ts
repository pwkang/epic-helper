import type {IGuild} from '@epic-helper/models';

export const toGuild = (guild: IGuild): IGuild => {
  return {
    serverId: guild?.serverId,
    roleId: guild?.roleId,
    leaderId: guild?.leaderId,
    info: {
      name: guild?.info?.name,
      stealth: guild?.info?.stealth ?? 0,
      level: guild?.info?.level ?? 0,
      energy: guild?.info?.energy ?? 0,
    },
    upgraid: {
      channelId: guild?.upgraid?.channelId,
      targetStealth: guild?.upgraid?.targetStealth,
      message: {
        upgrade: guild?.upgraid?.message?.upgrade,
        raid: guild?.upgraid?.message?.raid,
      },
      readyAt: guild?.upgraid?.readyAt,
    },
    toggle: {
      onOff: guild?.toggle?.onOff ?? true,
      duel: {
        log: {
          all: guild?.toggle?.duel?.log?.all ?? true,
          duelAdd: guild?.toggle?.duel?.log?.duelAdd ?? true,
          duelModify: guild?.toggle?.duel?.log?.duelModify ?? true,
          duelReset: guild?.toggle?.duel?.log?.duelReset ?? true,
          duelUndo: guild?.toggle?.duel?.log?.duelUndo ?? true,
        },
        refRequired: guild?.toggle?.duel?.refRequired ?? true,
      },
      upgraid: {
        allowReserved: guild?.toggle?.upgraid?.allowReserved ?? true,
        reminder: guild?.toggle?.upgraid?.reminder ?? true,
        sendUpgraidList: guild?.toggle?.upgraid?.sendUpgraidList ?? true,
      },
    },
    duel: {
      channelId: guild?.duel?.channelId,
    },
    membersId: guild?.membersId,
  };
};

export const toGuilds = (guilds: IGuild[]) => guilds.map(toGuild);
