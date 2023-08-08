export interface IDuelLog {
  usersId: string[];
  winnerId: string;
  expGained: number;
  duelAt: Date;
  serverId?: string;
  channelId?: string;
  messageId?: string;
}
