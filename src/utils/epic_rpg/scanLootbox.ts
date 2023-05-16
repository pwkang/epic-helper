import {Embed} from 'discord.js';
import {RPG_ITEMS} from '../../constants/rpg_items';

interface IScanLootbox {
  embed: Embed;
}

type ItemName = keyof typeof RPG_ITEMS;

type IInventoryItem = {
  [key in ItemName]?: number;
};

export default function scanLootbox({embed}: IScanLootbox) {
  const itemsList = embed.fields.flatMap((field) => field.value.split('\n'));
  const items: IInventoryItem = {};
  for (let row of itemsList) {
    const itemName = Object.entries(RPG_ITEMS).find(([key, value]) =>
      row.toLowerCase().includes(value)
    )?.[0] as ItemName;
    if (!itemName) continue;
    items[itemName] = Number((row.split(' ')[0] ?? '').replaceAll(',', '').replace('+', '')) ?? 0;
  }

  return items;
}
