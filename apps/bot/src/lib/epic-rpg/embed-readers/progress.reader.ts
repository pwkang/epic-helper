import {Embed} from 'discord.js';

interface IProfileReader {
  embed: Embed;
}

const profileReader = ({embed}: IProfileReader) => {
  const currentArea = embed.fields[0].value.split('\n')[2].match(/\*\*Area\*\*: (\d+)/)?.[1] ?? 0;
  const level = embed.fields[0].value.split('\n')[0].match(/\*\*Level\*\*: (\d+)/)?.[1] ?? 0;
  const maxArea = embed.fields[0].value.split('\n')[2].match(/\(Max: (\d+)\)/)?.[1] ?? 0;
  const timeTravels =
    embed.fields[0].value.split('\n')[3].match(/\*\*Time travels\*\*: (\d+)/)?.[1] ?? 0;

  return {
    level: Number(level),
    currentArea: Number(currentArea),
    maxArea: Number(maxArea),
    timeTravels: Number(timeTravels),
  };
};

export default profileReader;
