import type {Embed} from 'discord.js';
import ms from 'ms';

export interface IGuildReader {
  embed: Embed;
}

const guildReader = ({embed}: IGuildReader) => {
  const name = embed.description?.split('**')[1];
  const level = embed.fields?.[0].value.split('\n')[0].match(/\d+/g)?.[0] ?? 0;
  const xp = embed.fields?.[0].value.split('\n')[1].match(/\d+/g)?.[0] ?? 0;
  const energy = embed.fields?.[1].value.split('\n')[0].match(/\d+/g)?.[0] ?? 0;
  const stealth =
    embed.fields?.[1].value.split('\n')[1].match(/\d+/g)?.[0] ?? 0;
  const time =
    embed.fields?.[1].value.split('\n')[3]?.split('**')[1]?.split(' ') ?? [];

  return {
    name,
    level: Number(level),
    xp: Number(xp),
    stealth: Number(stealth),
    readyIn: time.reduce((acc, curr) => {
      return acc + ms(curr);
    }, 0),
    energy: Number(energy)
  };
};

export default guildReader;
