import {IInventoryItem} from './scanInventory';
import {RpgArea} from '../../../types/rpg.types';
import {RPG_TRADE_RATE} from '../../../constants/epic_rpg/rpg';
import {dismantleRecommend} from './dismantleMaterals';

interface IStartTrading {
  inventory: IInventoryItem;
  startArea: RpgArea;
  endArea: RpgArea;
  tradeTo: 'normieFish' | 'woodenLog' | 'apple' | 'ruby';
}

export const startTrading = ({startArea, endArea, inventory, tradeTo}: IStartTrading) => {
  const _tradeTo = endArea === 'top' ? 15 : endArea;
  let newInventory = initTrade(inventory);
  if (typeof startArea === 'number') {
    for (let area = startArea; area <= _tradeTo; area++) {
      if (area <= 3) {
        newInventory = newInventory.dismantleAll(area).tradeC(area).tradeB(area);
      } else if (area <= 5) {
        newInventory = newInventory.dismantleAll(area).tradeA(area).tradeE(area).tradeD(area);
      } else if (area <= 7) {
        newInventory = newInventory.dismantleAll(area).tradeC(area).tradeA(area).tradeE(area);
      } else if (area <= 8) {
        newInventory = newInventory.dismantleAll(area).tradeE(area).tradeA(area).tradeD(area);
      } else if (area <= 9) {
        newInventory = newInventory.dismantleAll(area).tradeE(area).tradeC(area).tradeB(area);
      } else if (area <= 15) {
        newInventory = newInventory.dismantleAll(area).tradeA(area).tradeE(area).tradeC(area);
      }
    }
  }
  console.log('newInventory', newInventory);
  switch (tradeTo) {
    case 'normieFish':
      newInventory = newInventory.tradeE(endArea).tradeC(endArea).tradeB(endArea);
      break;
    case 'woodenLog':
      newInventory = newInventory.tradeA(endArea).tradeC(endArea).tradeE(endArea);
      break;
    case 'apple':
      newInventory = newInventory.tradeA(endArea).tradeE(endArea).tradeD(endArea);
      break;
    case 'ruby':
      newInventory = newInventory.tradeA(endArea).tradeC(endArea).tradeF(endArea);
      break;
  }
  return newInventory;
};

interface IInitTradeReturn extends IInventoryItem {
  tradeA: (area: RpgArea) => IInitTradeReturn;
  tradeB: (area: RpgArea) => IInitTradeReturn;
  tradeC: (area: RpgArea) => IInitTradeReturn;
  tradeD: (area: RpgArea) => IInitTradeReturn;
  tradeE: (area: RpgArea) => IInitTradeReturn;
  tradeF: (area: RpgArea) => IInitTradeReturn;

  dismantleAll(area: RpgArea): IInitTradeReturn;
}

export function initTrade(inventory: IInventoryItem) {
  return <IInitTradeReturn>{
    ...inventory,
    tradeA: function (area) {
      const tradeRate = RPG_TRADE_RATE[area]?.tradeA;
      if (!tradeRate) return this;
      const {normieFish, woodenLog} = trade(this, 'normieFish', 'woodenLog', tradeRate);
      this.normieFish = normieFish;
      this.woodenLog = woodenLog;
      return this;
    },
    tradeB: function (area) {
      const tradeRate = RPG_TRADE_RATE[area]?.tradeB;
      if (!tradeRate) return this;
      const {woodenLog, normieFish} = trade(this, 'woodenLog', 'normieFish', tradeRate);
      this.woodenLog = woodenLog;
      this.normieFish = normieFish;
      return this;
    },
    tradeC: function (area) {
      const tradeRate = RPG_TRADE_RATE[area]?.tradeC;
      if (!tradeRate) return this;
      const {apple, woodenLog} = trade(this, 'apple', 'woodenLog', tradeRate);
      this.apple = apple;
      this.woodenLog = woodenLog;
      return this;
    },
    tradeD: function (area) {
      const tradeRate = RPG_TRADE_RATE[area]?.tradeD;
      if (!tradeRate) return this;
      const {woodenLog, apple} = trade(this, 'woodenLog', 'apple', tradeRate);
      this.woodenLog = woodenLog;
      this.apple = apple;
      return this;
    },
    tradeE: function (area) {
      const tradeRate = RPG_TRADE_RATE[area]?.tradeE;
      if (!tradeRate) return this;
      const {ruby, woodenLog} = trade(this, 'ruby', 'woodenLog', tradeRate);
      this.ruby = ruby;
      this.woodenLog = woodenLog;
      return this;
    },
    tradeF: function (area) {
      const tradeRate = RPG_TRADE_RATE[area]?.tradeF;
      if (!tradeRate) return this;
      const {woodenLog, ruby} = trade(this, 'woodenLog', 'ruby', tradeRate);
      this.woodenLog = woodenLog;
      this.ruby = ruby;
      return this;
    },
    dismantleAll: function (area) {
      return {
        ...this,
        ...dismantleRecommend(this, area),
      };
    },
    end: function () {
      return this;
    },
  };
}

/**
 *  ==========================================
 *         Trade Helper Function
 *  ==========================================
 */

const trade = <T, X extends keyof IInventoryItem, Y extends keyof IInventoryItem>(
  inventory: IInventoryItem,
  fromItem: X,
  toItem: Y,
  tradeRate: number
): Record<X | Y, number> => {
  const fromItemAmount = inventory[fromItem] ?? 0;
  const toItemAmount = inventory[toItem] ?? 0;
  const tradedAmount = Math.floor(fromItemAmount * tradeRate);
  inventory[toItem] = toItemAmount + tradedAmount;
  inventory[fromItem] = fromItemAmount - tradedAmount / tradeRate;
  return {
    [fromItem]: inventory[fromItem],
    [toItem]: inventory[toItem],
  } as Record<X | Y, number>;
};
