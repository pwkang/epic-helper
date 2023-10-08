import embedReaders from '../../../epic-rpg/embed-readers';
import type {Client, Message, User} from 'discord.js';
import {registerUserDuelLog} from './common/register-user-duel-log';

interface IAddDuelRecord {
  users: User[];
  duelMessage: Message<true>;
  client: Client;
}

export const autoAddDuelRecord = async ({
  users,
  duelMessage,
  client
}: IAddDuelRecord) => {
  const duelResult = embedReaders.duelResult({
    embed: duelMessage.embeds[0],
    users
  });

  for (const user of duelResult.usersExp) {
    const author = users.find((u) => u.id === user.userId);
    if (!author) continue;
    await registerUserDuelLog({
      client,
      expGained: user.guildExp,
      source: {
        serverId: duelMessage.guild.id,
        channelId: duelMessage.channel.id,
        messageId: duelMessage.id
      },
      author,
      isWinner: user.isWinner,
      commandChannelId: duelMessage.channel.id
    });
  }
};
