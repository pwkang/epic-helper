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
}

export const manualAddDuelRecord = async ({
  user,
  source,
  expGained,
  client,
  hasWon,
}: IManualAddDuelRecord): Promise<EmbedBuilder> => {
  return await registerUserDuelLog({
    client,
    source,
    expGained,
    author: user,
    isWinner: hasWon,
  });
};
