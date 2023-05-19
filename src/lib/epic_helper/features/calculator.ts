import {Embed, EmbedBuilder, MessageCreateOptions, User} from 'discord.js';
import {BOT_COLOR, PREFIX} from '../../../constants/bot';
import {CLICKABLE_SLASH_RPG} from '../../../constants/clickable_slash';
import scanInventory, {IInventoryItem} from '../../../utils/epic_rpg/scanInventory';
import {RpgArea} from '../../../types/rpg.types';
import {TRADE_RATE} from '../../../constants/rpg';
import {BOT_EMOJI} from '../../../constants/bot_emojis';

interface ICalcOptions {
  embed: Embed;
  area: RpgArea;
  author: User;
}

type TCalcFunc = (options: ICalcOptions) => MessageCreateOptions;

export const getCalcMaterialMessage: TCalcFunc = ({embed, area, author}) => {
  const inventory = scanInventory({embed});
  const a3Fish = startTrading({
    startArea: area,
    endArea: 3,
    inventory,
    tradeTo: 'normieFish',
  }).normieFish;
  const a5Apple = startTrading({
    startArea: area,
    endArea: 5,
    inventory,
    tradeTo: 'apple',
  }).apple;
  const a10Log = startTrading({
    startArea: area,
    endArea: 10,
    inventory,
    tradeTo: 'woodenLog',
  }).woodenLog;
  const a11Apple = startTrading({
    startArea: area,
    endArea: 11,
    inventory,
    tradeTo: 'apple',
  }).apple;
  const a12Ruby = startTrading({
    startArea: area,
    endArea: 12,
    inventory,
    tradeTo: 'ruby',
  }).ruby;
  const topFish = startTrading({
    startArea: area,
    endArea: 'top',
    inventory,
    tradeTo: 'normieFish',
  }).normieFish;
  const topLog = startTrading({
    startArea: area,
    endArea: 'top',
    inventory,
    tradeTo: 'woodenLog',
  }).woodenLog;
  const topApple = startTrading({
    startArea: area,
    endArea: 'top',
    inventory,
    tradeTo: 'apple',
  }).apple;
  const topRuby = startTrading({
    startArea: area,
    endArea: 'top',
    inventory,
    tradeTo: 'ruby',
  }).ruby;

  const tradeEmbed = new EmbedBuilder()
    .setAuthor({
      name: `${author.username}'s Material Calculator (Current Area ${area})`,
      iconURL: author.displayAvatarURL(),
    })
    .setDescription('Assuming you dismantle all the materials and follow the trade rate')
    .addFields([
      {
        name: 'Materials',
        value:
          `${BOT_EMOJI.working.normieFish} \`[  A3  ]\`: ${a3Fish?.toLocaleString()}\n` +
          `${BOT_EMOJI.working.apple} \`[  A5  ]\`: ${a5Apple?.toLocaleString()}\n` +
          `${BOT_EMOJI.working.woodenLog} \`[ A10+ ]\`: ${a10Log?.toLocaleString()}\n` +
          `${BOT_EMOJI.working.apple} \`[ A11+ ]\`: ${a11Apple?.toLocaleString()}\n` +
          `${BOT_EMOJI.working.ruby} \`[ A12+ ]\`: ${a12Ruby?.toLocaleString()}`,
        inline: true,
      },
      {
        name: 'Materials (TOP)',
        value:
          `${BOT_EMOJI.working.normieFish}: ${topFish?.toLocaleString()}\n` +
          `${BOT_EMOJI.working.woodenLog}: ${topLog?.toLocaleString()}\n` +
          `${BOT_EMOJI.working.apple}: ${topApple?.toLocaleString()}\n` +
          `${BOT_EMOJI.working.ruby}: ${topRuby?.toLocaleString()}`,
        inline: true,
      },
    ])
    .setColor(BOT_COLOR.embed);

  return {
    embeds: [tradeEmbed],
  };
};

export const getCalcSTTMessage: TCalcFunc = ({embed, area}) => {
  return {
    content: 'stt',
  };
};

type IDismantleEverything = (inventory: IInventoryItem, currentArea: RpgArea) => IInventoryItem;

const dismantleRecommend: IDismantleEverything = (inventory, currentArea) => {
  const newInventory = initDismantle(inventory);

  if (typeof currentArea === 'number') {
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
      newInventory.dismantleGoldenFish().dismantleBanana();
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

interface ITrade {
  inventory: IInventoryItem;
  startArea: RpgArea;
  endArea: RpgArea;
  tradeTo: 'normieFish' | 'woodenLog' | 'apple' | 'ruby';
}

const startTrading = ({startArea, endArea, inventory, tradeTo}: ITrade) => {
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

function initDismantle(inventory: IInventoryItem) {
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
}

interface IInitTradeReturn extends IInventoryItem {
  tradeA: (area: RpgArea) => IInitTradeReturn;
  tradeB: (area: RpgArea) => IInitTradeReturn;
  tradeC: (area: RpgArea) => IInitTradeReturn;
  tradeD: (area: RpgArea) => IInitTradeReturn;
  tradeE: (area: RpgArea) => IInitTradeReturn;
  tradeF: (area: RpgArea) => IInitTradeReturn;

  dismantleAll(area: RpgArea): IInitTradeReturn;
}

function initTrade(inventory: IInventoryItem) {
  return <IInitTradeReturn>{
    ...inventory,
    tradeA: function (area) {
      const tradeRate = TRADE_RATE[area]?.tradeA;
      if (!tradeRate) return this;
      const {normieFish, woodenLog} = trade(this, 'normieFish', 'woodenLog', tradeRate);
      this.normieFish = normieFish;
      this.woodenLog = woodenLog;
      return this;
    },
    tradeB: function (area) {
      const tradeRate = TRADE_RATE[area]?.tradeB;
      if (!tradeRate) return this;
      const {woodenLog, normieFish} = trade(this, 'woodenLog', 'normieFish', tradeRate);
      this.woodenLog = woodenLog;
      this.normieFish = normieFish;
      return this;
    },
    tradeC: function (area) {
      const tradeRate = TRADE_RATE[area]?.tradeC;
      if (!tradeRate) return this;
      const {apple, woodenLog} = trade(this, 'apple', 'woodenLog', tradeRate);
      this.apple = apple;
      this.woodenLog = woodenLog;
      return this;
    },
    tradeD: function (area) {
      const tradeRate = TRADE_RATE[area]?.tradeD;
      if (!tradeRate) return this;
      const {woodenLog, apple} = trade(this, 'woodenLog', 'apple', tradeRate);
      this.woodenLog = woodenLog;
      this.apple = apple;
      return this;
    },
    tradeE: function (area) {
      const tradeRate = TRADE_RATE[area]?.tradeE;
      if (!tradeRate) return this;
      const {ruby, woodenLog} = trade(this, 'ruby', 'woodenLog', tradeRate);
      this.ruby = ruby;
      this.woodenLog = woodenLog;
      return this;
    },
    tradeF: function (area) {
      const tradeRate = TRADE_RATE[area]?.tradeF;
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

/**
 *  ==========================================
 *            List of Checker here
 *  ==========================================
 */

export const isCalcMaterial = (args: string[]) =>
  (!isNaN(Number(args[1])) || args[1] === 'top') && isNaN(Number(args[2]));

export const isCalcSTT = (args: string[]) =>
  (!isNaN(Number(args[1])) || args[1] === 'top') && !isNaN(Number(args[2]));

type IGetCalcInfo = (args: string[]) => {
  area: RpgArea | null;
  level: number | null;
};

export const getCalcInfo: IGetCalcInfo = (args) => ({
  area: isNaN(Number(args[1]))
    ? args[1] === 'top'
      ? 'top'
      : null
    : Number(args[1]) <= 15 && Number(args[1]) >= 1
    ? (Number(args[1]) as RpgArea)
    : null,
  level: isNaN(Number(args[2])) ? null : Number(args[2]),
});

export const getInvalidCalcArgsMessage = (): MessageCreateOptions => {
  return {
    content:
      'Correct usage:\n' +
      `**Material Calculator:** \`${PREFIX.bot}calc [area]\`\n` +
      `**STT Calculator:** \`${PREFIX.bot}calc [area] [level]\``,
  };
};

export const getCalcInstructionMessage = (): MessageCreateOptions => {
  return {
    content: `Use ${CLICKABLE_SLASH_RPG.inventory} once`,
  };
};
