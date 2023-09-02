import {Client, EmbedBuilder, User} from 'discord.js';
import {registerUserDuelLog} from './common/register-user-duel-log';

interface IManualAddDuelRecord {
  user: User;
  client: Client;
  expGained: number;
  hasWon: boolean;
  source?: {
    serverId: string;
    channelId: string;
    messageId: string;
  };
  commandChannelId: string;
}

export const manualAddDuelRecord = async ({
  user,
  source,
  expGained,
  client,
  hasWon,
  commandChannelId,
}: IManualAddDuelRecord): Promise<EmbedBuilder> => {
  return await registerUserDuelLog({
    client,
    source,
    expGained,
    author: user,
    isWinner: hasWon,
    commandChannelId,
  });
};
