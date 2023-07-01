export interface IGuild {
  serverId: string;
  leaderId: string;
  roleId: string;
  info: {
    name: string;
    stealth: number;
    level: number;
    energy: number;
  };
  upgraid: {
    targetStealth: number;
    channelId: string;
    message: {
      upgrade: string;
      raid: string;
    };
    readyAt: Date;
  };
  toggle: {
    active: boolean;
    upgraid: {
      reminder: boolean;
      sendUpgraidList: boolean; // send the upgraid list after every upgraid
      allowReserved: boolean;
    };
    duel: {
      log: {
        active: boolean;
        duelAdd: boolean;
        duelUndo: boolean;
        duelReset: boolean;
        duelModify: boolean;
      };
      linkRequired: boolean;
      autoReset: boolean;
    };
  };
}
