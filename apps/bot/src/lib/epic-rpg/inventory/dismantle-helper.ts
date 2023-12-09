import type {IInventoryItem} from '../embed-readers/inventory.reader';
import type {RpgArea} from '../../../types/rpg.types';

type IDismantleEverything = (
  inventory: IInventoryItem,
  currentArea?: RpgArea,
) => IInventoryItem;

const dismantleRecommend: IDismantleEverything = (inventory, currentArea) => {
  const newInventory = new InitDismantle(inventory);

  if (typeof currentArea === 'number' && currentArea) {
    if (currentArea <= 3) {
      newInventory
        .dismantleBanana()
        .dismantleUltraLog()
        .dismantleHyperLog()
        .dismantleMegaLog()
        .dismantleSuperLog()
        .dismantleEpicLog()
        .dismantleEpicFish()
        .dismantleGoldenFish();
    } else if (currentArea <= 5) {
      newInventory
        .dismantleUltraLog()
        .dismantleHyperLog()
        .dismantleMegaLog()
        .dismantleSuperLog()
        .dismantleEpicLog()
        .dismantleEpicFish()
        .dismantleGoldenFish();
    } else if (currentArea <= 7) {
      newInventory.dismantleBanana();
    } else if (currentArea <= 8) {
      newInventory
        .dismantleUltraLog()
        .dismantleHyperLog()
        .dismantleMegaLog()
        .dismantleSuperLog()
        .dismantleEpicLog()
        .dismantleEpicFish()
        .dismantleGoldenFish();
    } else if (currentArea <= 9) {
      newInventory
        .dismantleMegaLog()
        .dismantleSuperLog()
        .dismantleEpicLog()
        .dismantleBanana();
    } else if (currentArea <= 10) {
      newInventory.dismantleBanana();
    } else if (currentArea <= 15) {
      newInventory
        .dismantleUltraLog()
        .dismantleHyperLog()
        .dismantleMegaLog()
        .dismantleSuperLog()
        .dismantleEpicLog()
        .dismantleEpicFish()
        .dismantleGoldenFish()
        .dismantleBanana();
    }
  } else {
    newInventory
      .dismantleUltraLog()
      .dismantleHyperLog()
      .dismantleMegaLog()
      .dismantleSuperLog()
      .dismantleEpicLog()
      .dismantleEpicFish()
      .dismantleGoldenFish()
      .dismantleBanana();
  }
  return newInventory.end();
};

class InitDismantle {
  private inventory: IInventoryItem;

  constructor(inventory: IInventoryItem) {
    this.inventory = {
      ...inventory,
    };
  }

  dismantleGoldenFish() {
    this.inventory.goldenFish = this.inventory.goldenFish ?? 0;
    this.inventory.normieFish = this.inventory.normieFish ?? 0;
    this.inventory.normieFish += this.inventory.goldenFish * 12;
    this.inventory.goldenFish = 0;
    return this;
  }

  dismantleEpicFish() {
    this.inventory.goldenFish = this.inventory.goldenFish ?? 0;
    this.inventory.epicFish = this.inventory.epicFish ?? 0;
    this.inventory.goldenFish += this.inventory.epicFish * 80;
    this.inventory.epicFish = 0;
    return this;
  }

  dismantleUltraLog() {
    this.inventory.ultraLog = this.inventory.ultraLog ?? 0;
    this.inventory.hyperLog = this.inventory.hyperLog ?? 0;
    this.inventory.hyperLog += this.inventory.ultraLog * 8;
    this.inventory.ultraLog = 0;
    return this;
  }

  dismantleHyperLog() {
    this.inventory.hyperLog = this.inventory.hyperLog ?? 0;
    this.inventory.megaLog = this.inventory.megaLog ?? 0;
    this.inventory.megaLog += this.inventory.hyperLog * 8;
    this.inventory.hyperLog = 0;
    return this;
  }

  dismantleMegaLog() {
    this.inventory.megaLog = this.inventory.megaLog ?? 0;
    this.inventory.superLog = this.inventory.superLog ?? 0;
    this.inventory.superLog += this.inventory.megaLog * 8;
    this.inventory.megaLog = 0;
    return this;
  }

  dismantleSuperLog() {
    this.inventory.superLog = this.inventory.superLog ?? 0;
    this.inventory.epicLog = this.inventory.epicLog ?? 0;
    this.inventory.epicLog += this.inventory.superLog * 8;
    this.inventory.superLog = 0;
    return this;
  }

  dismantleEpicLog() {
    this.inventory.epicLog = this.inventory.epicLog ?? 0;
    this.inventory.woodenLog = this.inventory.woodenLog ?? 0;
    this.inventory.woodenLog += this.inventory.epicLog * 20;
    this.inventory.epicLog = 0;
    return this;
  }

  dismantleBanana() {
    this.inventory.banana = this.inventory.banana ?? 0;
    this.inventory.apple = this.inventory.apple ?? 0;
    this.inventory.apple += this.inventory.banana * 12;
    this.inventory.banana = 0;
    return this;
  }

  end() {
    return this.inventory;
  }
}

const dismantleHelper = {
  dismantleRecommend,
  InitDismantle,
};

export default dismantleHelper;
