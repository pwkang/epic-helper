import type {Embed, User} from 'discord.js';
import type {IUserDuelUser} from '@epic-helper/models';

interface IDuelResultReader {
  embed: Embed;
  users: User[];
}

const duelResultReader = ({embed, users}: IDuelResultReader) => {
  const winner = users.find(
    (user) => embed.fields[0].name === `**${user.username}** won!`
  );
  const exp: IUserDuelUser[] = [];
  for (const user of users) {
    const regex = new RegExp(
      `\\*\\*${user.username}\\*\\*'s guild got (\\d) XP`
    );
    const expGained = embed.fields[0].value.match(regex)?.[1];
    exp.push({
      userId: user.id,
      isWinner: user.id === winner?.id,
      guildExp: expGained ? parseInt(expGained) : 0
    });
  }
  return {
    winner,
    usersExp: exp
  };
};

export default duelResultReader;
