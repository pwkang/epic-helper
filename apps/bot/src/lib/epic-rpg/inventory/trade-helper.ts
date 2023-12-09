import type {IInventoryItem, TRpgItemName} from '../embed-readers/inventory.reader';
import type {RpgArea} from '../../../types/rpg.types';
import dismantleHelper from './dismantle-helper';
import {RPG_TRADE_RATE} from '@epic-helper/constants';

interface IStartTrading {
  inventory: IInventoryItem;
  startArea: RpgArea;
  endArea: RpgArea;
  tradeTo: 'normieFish' | 'woodenLog' | 'apple' | 'ruby';
}

export const startTrading = ({
  startArea,
  endArea,
  inventory,
  tradeTo,
}: IStartTrading) => {
  const _tradeTo = endArea === 'top' ? 15 : endArea;
  const newInventory = new InitTrade(inventory);
  if (typeof startArea === 'number') {
    for (let area = startArea; area <= _tradeTo; area++) {
      if (area <= 3) {
        newInventory.dismantleAll(area).tradeC(area).tradeB(area);
      } else if (area <= 5) {
        newInventory.dismantleAll(area).tradeA(area).tradeE(area).tradeD(area);
      } else if (area <= 7) {
        newInventory.dismantleAll(area).tradeC(area).tradeA(area).tradeE(area);
      } else if (area <= 8) {
        newInventory.dismantleAll(area).tradeE(area).tradeA(area).tradeD(area);
      } else if (area <= 9) {
        newInventory.dismantleAll(area).tradeE(area).tradeC(area).tradeB(area);
      } else if (area <= 15) {
        newInventory.dismantleAll(area).tradeA(area).tradeE(area).tradeC(area);
      }
    }
  }
  switch (tradeTo) {
    case 'normieFish':
      newInventory.tradeE(endArea).tradeC(endArea).tradeB(endArea);
      break;
    case 'woodenLog':
      newInventory.tradeA(endArea).tradeC(endArea).tradeE(endArea);
      break;
    case 'apple':
      newInventory.tradeA(endArea).tradeE(endArea).tradeD(endArea);
      break;
    case 'ruby':
      newInventory.tradeA(endArea).tradeC(endArea).tradeF(endArea);
      break;
  }
  return newInventory.end();
};

class InitTrade {
  private inventory: IInventoryItem;

  constructor(inventory: IInventoryItem) {
    this.inventory = {
      ...inventory,
    };
  }

  tradeA(area: RpgArea) {
    const tradeRate = RPG_TRADE_RATE[area]?.tradeA;
    if (!tradeRate) return this;
    this.trade('normieFish', 'woodenLog', tradeRate);
    return this;
  }

  tradeB(area: RpgArea) {
    const tradeRate = RPG_TRADE_RATE[area]?.tradeB;
    if (!tradeRate) return this;
    this.trade('woodenLog', 'normieFish', tradeRate);
    return this;
  }

  tradeC(area: RpgArea) {
    const tradeRate = RPG_TRADE_RATE[area]?.tradeC;
    if (!tradeRate) return this;
    this.trade('apple', 'woodenLog', tradeRate);
    return this;
  }

  tradeD(area: RpgArea) {
    const tradeRate = RPG_TRADE_RATE[area]?.tradeD;
    if (!tradeRate) return this;
    this.trade('woodenLog', 'apple', tradeRate);
    return this;
  }

  tradeE(area: RpgArea) {
    const tradeRate = RPG_TRADE_RATE[area]?.tradeE;
    if (!tradeRate) return this;
    this.trade('ruby', 'woodenLog', tradeRate);
    return this;
  }

  tradeF(area: RpgArea) {
    const tradeRate = RPG_TRADE_RATE[area]?.tradeF;
    if (!tradeRate) return this;
    this.trade('woodenLog', 'ruby', tradeRate);
    return this;
  }

  dismantleAll(area: RpgArea) {
    this.inventory = dismantleHelper.dismantleRecommend(this.inventory, area);
    return this;
  }

  trade(fromItem: TRpgItemName, toItem: TRpgItemName, tradeRate: number) {
    const fromItemAmount = this.inventory[fromItem] ?? 0;
    const toItemAmount = this.inventory[toItem] ?? 0;
    const tradedAmount = Math.floor(fromItemAmount * tradeRate);
    this.inventory[toItem] = toItemAmount + tradedAmount;
    this.inventory[fromItem] = fromItemAmount - tradedAmount / tradeRate;
  }

  end() {
    return this.inventory;
  }
}

/**
 *  ==========================================
 *         Trade Helper Function
 *  ==========================================
 */

// const trade = <T, X extends keyof IInventoryItem, Y extends keyof IInventoryItem>(
//   inventory: IInventoryItem,
//   fromItem: X,
//   toItem: Y,
//   tradeRate: number
// ): Record<X | Y, number> => {
//   const fromItemAmount = inventory[fromItem] ?? 0;
//   const toItemAmount = inventory[toItem] ?? 0;
//   const tradedAmount = Math.floor(fromItemAmount * tradeRate);
//   inventory[toItem] = toItemAmount + tradedAmount;
//   inventory[fromItem] = fromItemAmount - tradedAmount / tradeRate;
//   return {
//     [fromItem]: inventory[fromItem],
//     [toItem]: inventory[toItem],
//   } as Record<X | Y, number>;
// };
//
const tradeHelper = {
  startTrading,
};

export default tradeHelper;
