import {Embed} from 'discord.js';
import {createJsonBin, typedObjectEntries} from '@epic-helper/utils';
import {RPG_WILD_PET_TYPE} from '@epic-helper/constants';

interface IWildPetReader {
  embed: Embed;
}

const wildPetReader = ({embed}: IWildPetReader) => {
  const happiness = embed.fields[0].value.match(/\*\*Happiness\*\*: (\d+)/)?.[1] ?? 0;
  const hunger = embed.fields[0].value.match(/\*\*Hunger\*\*: (\d+)/)?.[1] ?? 0;
  const petName = embed.fields[0].name.match(/SUDDENLY, A \*\*([\w\s]+)\*\*/)?.[1] ?? '';
  const owner = embed.fields[0].name.match(/APPROACHING \*\*([\s\S]+)\*\*$/)?.[1] ?? '';
  return {
    happiness: Number(happiness),
    hunger: Number(hunger),
    petName:
      typedObjectEntries(RPG_WILD_PET_TYPE).find(
        ([, value]) => value.toLowerCase() === petName.toLowerCase().replaceAll(' ', '')
      )?.[0] ?? null,
    owner: owner.trim() === '' ? null : owner.trim(),
  };
};

export default wildPetReader;
