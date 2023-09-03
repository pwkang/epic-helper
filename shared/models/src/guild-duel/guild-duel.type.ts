export interface IGuildDuelUser {
  userId: string;
  totalExp: number;
  duelCount: number;
}

export interface IGuildDuel {
  serverId: string;
  guildRoleId: string;
  weekAt: Date;
  users: IGuildDuelUser[];
}
