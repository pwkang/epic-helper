export interface IUserDuelUser {
  userId: string;
  guildExp: number;
  isWinner: boolean;
  reportGuild?: {
    serverId: string;
    guildRoleId: string;
  };
}

export interface IUserDuel {
  users: IUserDuelUser[];
  duelAt: Date;
  source?: {
    serverId: string;
    channelId: string;
    messageId: string;
  };
}
