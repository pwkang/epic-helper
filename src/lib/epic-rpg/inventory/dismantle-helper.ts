import {IInventoryItem} from '../embed-readers/inventory.reader';
import {RpgArea} from '../../../types/rpg.types';

type IDismantleEverything = (inventory: IInventoryItem, currentArea?: RpgArea) => IInventoryItem;

const dismantleRecommend: IDismantleEverything = (inventory, currentArea) => {
  const newInventory = dismantleHelper.initDismantle(inventory);

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
      newInventory.dismantleMegaLog().dismantleSuperLog().dismantleEpicLog().dismantleBanana();
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
  return {
    ...inventory,
    ...newInventory,
  };
};

interface IInitDismantleReturn extends IInventoryItem {
  dismantleGoldenFish: () => IInitDismantleReturn;
  dismantleEpicFish: () => IInitDismantleReturn;
  dismantleEpicLog: () => IInitDismantleReturn;
  dismantleSuperLog: () => IInitDismantleReturn;
  dismantleMegaLog: () => IInitDismantleReturn;
  dismantleHyperLog: () => IInitDismantleReturn;
  dismantleUltraLog: () => IInitDismantleReturn;
  dismantleBanana: () => IInitDismantleReturn;
}

const initDismantle = (inventory: IInventoryItem) => {
  return <IInitDismantleReturn>{
    ...inventory,
    dismantleGoldenFish: function () {
      this.goldenFish = this.goldenFish ?? 0;
      this.normieFish = this.normieFish ?? 0;
      this.normieFish += this.goldenFish * 12;
      this.goldenFish = 0;
      return this;
    },
    dismantleEpicFish: function () {
      this.goldenFish = this.goldenFish ?? 0;
      this.epicFish = this.epicFish ?? 0;
      this.goldenFish += this.epicFish * 80;
      this.epicFish = 0;
      return this;
    },
    dismantleUltraLog: function () {
      this.ultraLog = this.ultraLog ?? 0;
      this.hyperLog = this.hyperLog ?? 0;
      this.hyperLog += this.ultraLog * 8;
      this.ultraLog = 0;
      return this;
    },
    dismantleHyperLog: function () {
      this.hyperLog = this.hyperLog ?? 0;
      this.megaLog = this.megaLog ?? 0;
      this.megaLog += this.hyperLog * 8;
      this.hyperLog = 0;
      return this;
    },
    dismantleMegaLog: function () {
      this.megaLog = this.megaLog ?? 0;
      this.superLog = this.superLog ?? 0;
      this.superLog += this.megaLog * 8;
      this.megaLog = 0;
      return this;
    },
    dismantleSuperLog: function () {
      this.superLog = this.superLog ?? 0;
      this.epicLog = this.epicLog ?? 0;
      this.epicLog += this.superLog * 8;
      this.superLog = 0;
      return this;
    },
    dismantleEpicLog: function () {
      this.epicLog = this.epicLog ?? 0;
      this.woodenLog = this.woodenLog ?? 0;
      this.woodenLog += this.epicLog * 20;
      this.epicLog = 0;
      return this;
    },
    dismantleBanana: function () {
      this.banana = this.banana ?? 0;
      this.apple = this.apple ?? 0;
      this.apple += this.banana * 12;
      this.banana = 0;
      return this;
    },
  };
};

const dismantleHelper = {
  dismantleRecommend,
  initDismantle,
};

export default dismantleHelper;
