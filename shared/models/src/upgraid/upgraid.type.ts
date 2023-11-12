interface IRecord {
  commandType: 'upgraid' | 'raid';
  upgraidAt: Date;
  serverId: string;
  channelId: string;
  messageId: string;
}

interface IUpgraidUser {
  uId: string;
  records: IRecord[];
}

export interface IUpgraid {
  serverId: string;
  roleId: string;
  weekAt: Date;
  users: IUpgraidUser[];
}
