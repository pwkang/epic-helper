import type {Embed} from 'discord.js';
import {RPG_ITEMS} from '@epic-helper/constants';
import {typedObjectEntries} from '@epic-helper/utils';

export interface IScanLootbox {
  embed: Embed;
}

type ItemName = keyof typeof RPG_ITEMS;

type IInventoryItem = {
  [key in ItemName]?: number;
};

const lootboxReader = ({embed}: IScanLootbox) => {
  const itemsList = embed.fields.flatMap((field) => field.value.split('\n'));
  const items: IInventoryItem = {};
  for (const row of itemsList) {
    const itemName = typedObjectEntries(RPG_ITEMS).find(([, value]) =>
      row.toLowerCase().includes(value),
    )?.[0] as ItemName;
    if (!itemName) continue;
    items[itemName] =
      Number((row.split(' ')[0] ?? '').replaceAll(',', '').replace('+', '')) ??
      0;
  }

  return items;
};

export default lootboxReader;
