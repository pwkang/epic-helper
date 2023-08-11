import {Embed} from 'discord.js';
import {RPG_ITEMS} from '@epic-helper/constants';
import {typedObjectEntries} from '@epic-helper/utils';

export interface IScanInventory {
  embed: Embed;
}

export type TRpgItemName = keyof typeof RPG_ITEMS;

export type IInventoryItem = Partial<Record<TRpgItemName, number>>;

const inventoryReader = ({embed}: IScanInventory) => {
  const itemsList = embed.fields.flatMap((field) => field.value.split('\n'));
  const items: IInventoryItem = {};
  for (const row of itemsList) {
    const itemName = typedObjectEntries(RPG_ITEMS).find(([, value]) =>
      row.toLowerCase().includes(`**${value}**`)
    )?.[0];
    if (!itemName) continue;
    items[itemName] = Number((row.split(' ').pop() ?? '').replaceAll(',', '')) ?? 0;
  }

  return items;
};

export default inventoryReader;
