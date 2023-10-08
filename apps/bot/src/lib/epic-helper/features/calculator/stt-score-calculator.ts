import type {Embed, EmbedField, MessageCreateOptions, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import type {RpgArea} from '../../../../types/rpg.types';
import tradeHelper from '../../../epic-rpg/inventory/trade-helper';
import dismantleHelper from '../../../epic-rpg/inventory/dismantle-helper';
import embedReaders from '../../../epic-rpg/embed-readers';
import {BOT_COLOR, BOT_EMOJI, RPG_STT_SCORE} from '@epic-helper/constants';
import {typedObjectEntries} from '@epic-helper/utils';

interface ICalcSttOptions {
  embed: Embed;
  area: RpgArea;
  author: User;
  level: number;
}

type TCalcFunc = (options: ICalcSttOptions) => MessageCreateOptions;

type SttItems = keyof typeof RPG_STT_SCORE;

type ICalcSTTScore = {
  [key in SttItems]?: number;
};

export const getCalcSTTMessage: TCalcFunc = ({embed, area, level, author}) => {
  const inventory = embedReaders.inventory({embed});
  const a15Inventory = tradeHelper.startTrading({
    startArea: area,
    endArea: 15,
    tradeTo: 'ruby',
    inventory,
  });
  const dismantleAll = dismantleHelper.dismantleRecommend(a15Inventory);
  const score: ICalcSTTScore = {
    level: level * RPG_STT_SCORE.level,
  };
  for (const [key, rate] of typedObjectEntries(RPG_STT_SCORE)) {
    if (key === 'level') {
      // skip
    } else if (key === 'stats') {
      // skip
    } else if (key in dismantleAll) {
      score[key] = Math.ceil((dismantleAll[key] ?? 0) * rate);
    }
  }
  let total = 0;
  for (const [, value] of Object.entries(score)) {
    total += value ?? 0;
  }

  const resultEmbed = buildCalcSTTEmbed({items: score, author, total});

  return {
    embeds: [resultEmbed],
  };
};

/**
 *  ==========================================
 *            Embed Builder
 *  ==========================================
 */

interface IBuildCalcSTTEmbed {
  items: ICalcSTTScore;
  author: User;
  total: number;
}

const buildCalcSTTEmbed = ({items, author, total}: IBuildCalcSTTEmbed) => {
  const embed = new EmbedBuilder();

  embed
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: `${author.username}'s STT Score Calculator`,
      iconURL: author.displayAvatarURL(),
    })
    .setDescription(
      `:small_orange_diamond: Assuming you dismantle all the materials, follow the trade rate and trade all materials to ruby
      
      Time Travel Score: ≈ ${total.toLocaleString()}
      `
    )
    .setFooter({
      text: 'Feel free to report to support server if you have more accurate value,',
    });

  const fields: EmbedField[] = [];
  for (const {label, items: itemList} of groupItems) {
    const field: EmbedField = {
      name: label,
      value: itemList
        .map((item) => {
          const value = items[item.key];
          if (!value) return '';
          return `${item.emoji ?? ''} **${
            item.label
          }**: ${value.toLocaleString()}`;
        })
        .filter((value) => value)
        .join('\n'),
      inline: true,
    };
    fields.push(field);
  }

  embed.addFields(fields);
  return embed;
};

/**
 *  ==========================================
 *            List of Checker here
 *  ==========================================
 */

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

const sttScoreCalculator = {
  isCalcSTT,
  getCalcInfo,
  getCalcSTTMessage,
};

export default sttScoreCalculator;

/**
 * ==========================================
 *           Items Grouping
 * ==========================================
 */

interface IGroupItem {
  key: keyof typeof RPG_STT_SCORE;
  label: string;
  emoji?: string;
}

interface IGroupItems {
  label: string;
  items: IGroupItem[];
}

const groupItems: IGroupItems[] = [
  {
    label: 'Items Score',
    items: [
      // 'ultimateLog',
      {
        key: 'ultimateLog',
        label: 'Ultimate Log',
        emoji: BOT_EMOJI.working.ultimateLog,
      },

      // 'superFish',
      {
        key: 'superFish',
        label: 'Super Fish',
        emoji: BOT_EMOJI.working.superFish,
      },

      // 'ruby',
      {
        key: 'ruby',
        label: 'Ruby',
        emoji: BOT_EMOJI.working.ruby,
      },

      // 'wolfSkin',
      {
        key: 'wolfSkin',
        label: 'Wolf Skin',
        emoji: BOT_EMOJI.drops.wolfSkin,
      },

      // 'zombieEye',
      {
        key: 'zombieEye',
        label: 'Zombie Eye',
        emoji: BOT_EMOJI.drops.zombieEye,
      },

      // 'unicornHorn',
      {
        key: 'unicornHorn',
        label: 'Unicorn Horn',
        emoji: BOT_EMOJI.drops.unicornHorn,
      },

      // 'mermaidHair',
      {
        key: 'mermaidHair',
        label: 'Mermaid Hair',
        emoji: BOT_EMOJI.drops.mermaidHair,
      },

      // 'chip',
      {
        key: 'chip',
        label: 'Chip',
        emoji: BOT_EMOJI.drops.chip,
      },

      // 'dragonScale',
      {
        key: 'dragonScale',
        label: 'Dragon Scale',
        emoji: BOT_EMOJI.drops.dragonScale,
      },

      // 'darkEnergy',
      {
        key: 'darkEnergy',
        label: 'Dark Energy',
        emoji: BOT_EMOJI.drops.darkEnergy,
      },

      // 'potato',
      {
        key: 'potato',
        label: 'Potato',
        emoji: BOT_EMOJI.farming.potato,
      },

      // 'carrot',
      {
        key: 'carrot',
        label: 'Carrot',
        emoji: BOT_EMOJI.farming.carrot,
      },

      // 'bread',
      {
        key: 'bread',
        label: 'Bread',
        emoji: BOT_EMOJI.farming.bread,
      },

      // 'seed',
      {
        key: 'seed',
        label: 'Seed',
        emoji: BOT_EMOJI.farming.seed,
      },

      // 'potatoSeed',
      {
        key: 'potatoSeed',
        label: 'Potato Seed',
        emoji: BOT_EMOJI.farming.potatoSeed,
      },

      // 'carrotSeed',
      {
        key: 'carrotSeed',
        label: 'Carrot Seed',
        emoji: BOT_EMOJI.farming.carrotSeed,
      },

      // 'breadSeed',
      {
        key: 'breadSeed',
        label: 'Bread Seed',
        emoji: BOT_EMOJI.farming.breadSeed,
      },
    ],
  },
  {
    label: 'Consumables Score',
    items: [
      // 'lifePotion',
      {
        key: 'lifePotion',
        label: 'Life Potion',
        emoji: BOT_EMOJI.items.lifePotion,
      },

      // 'lotteryTicket',
      {
        key: 'lotteryTicket',
        label: 'Lottery Ticket',
        emoji: BOT_EMOJI.items.lotteryTicket,
      },

      // 'commonLootbox',
      {
        key: 'commonLootbox',
        label: 'Common Lootbox',
        emoji: BOT_EMOJI.lootbox.commonLootbox,
      },

      // 'uncommonLootbox',
      {
        key: 'uncommonLootbox',
        label: 'Uncommon Lootbox',
        emoji: BOT_EMOJI.lootbox.uncommonLootbox,
      },

      // 'rareLootbox',
      {
        key: 'rareLootbox',
        label: 'Rare Lootbox',
        emoji: BOT_EMOJI.lootbox.rareLootbox,
      },

      // 'epicLootbox',
      {
        key: 'epicLootbox',
        label: 'Epic Lootbox',
        emoji: BOT_EMOJI.lootbox.epicLootbox,
      },

      // 'edgyLootbox',
      {
        key: 'edgyLootbox',
        label: 'Edgy Lootbox',
        emoji: BOT_EMOJI.lootbox.edgyLootbox,
      },

      // 'omegaLootbox',
      {
        key: 'omegaLootbox',
        label: 'Omega Lootbox',
        emoji: BOT_EMOJI.lootbox.omegaLootbox,
      },

      // 'godlyLootbox',
      {
        key: 'godlyLootbox',
        label: 'Godly Lootbox',
        emoji: BOT_EMOJI.lootbox.godlyLootbox,
      },
    ],
  },
  {
    label: 'Extra Score',
    items: [
      // 'level'
      {
        key: 'level',
        label: 'Level',
        emoji: ':up:',
      },
    ],
  },
];
