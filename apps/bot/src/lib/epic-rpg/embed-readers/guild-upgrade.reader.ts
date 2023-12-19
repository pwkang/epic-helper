import type {Embed} from 'discord.js';
import ms from 'ms';

export interface IGuildUpgradeReader {
  embed: Embed;
}

const guildUpgradeReader = ({embed}: IGuildUpgradeReader) => {
  const oldStealth = embed.fields?.[0].value.match(/\*\*(\d+)\*\* --> \*\*\d+\*\*/)?.[1] ?? '0';
  const newStealth = embed.fields?.[0].value.match(/\*\*\d+\*\* --> \*\*(\d+)\*\*/)?.[1] ?? '0';

  return {
    oldStealth: Number(oldStealth),
    newStealth: Number(newStealth),
  };
};

export default guildUpgradeReader;
