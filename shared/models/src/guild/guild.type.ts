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
}
