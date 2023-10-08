import type wildPetReader from '../embed-readers/wild-pet.reader';
import type {BaseMessageOptions} from 'discord.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import {BOT_COLOR, BOT_EMOJI, RPG_PET_THUMBNAIL} from '@epic-helper/constants';

interface IGeneratePetCatchCommand {
  info: ReturnType<typeof wildPetReader>;
  clicked?: number;
}

interface ICmd {
  feed: number;
  pat: number;
  min: number;
  max: number;
  avg: number;
  isMax: boolean;
}

export const generatePetCatchMessageOptions = ({
  info,
  clicked = 0,
}: IGeneratePetCatchCommand): BaseMessageOptions => {
  const {hunger, petName, owner, happiness} = info;
  const commands = getCommands(hunger, happiness, clicked);

  return {
    embeds: [getEmbed(commands, owner ?? undefined, petName)],
    components: getComponents(commands),
  };
};

const getEmbed = (
  commands: ICmd[],
  owner?: string,
  petName?: ReturnType<typeof wildPetReader>['petName']
) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);
  if (owner) {
    embed.setFooter({
      text: `${owner}'s pet`,
    });
  }
  if (petName) {
    embed.setThumbnail(RPG_PET_THUMBNAIL[petName]);
  }
  for (let i = 0; i < commands.length; i++) {
    const {feed, pat, min, max, avg, isMax} = commands[i];
    const feedString = new Array(feed).fill('feed').join(' ');
    const patString = new Array(pat).fill('pat').join(' ');
    const isEmpty = !feed && !pat;
    const name = isEmpty ? '-' : `${feedString} ${patString}`;
    const value = isMax ? '100%' : `Min: ${min}% | Avg: ${avg}% | Max: ${max}%`;

    embed.addFields({
      name,
      value,
    });
  }
  return embed;
};

const getComponents = (commands: ICmd[]) => {
  const cmd = commands.pop();
  const pat1 = cmd?.pat ? cmd.pat % 2 : 0;
  const pat2 = cmd?.pat ? Math.floor(cmd.pat / 2) : 0;
  const feed1 = cmd?.feed ? cmd.feed % 2 : 0;
  const feed2 = cmd?.feed ? Math.floor(cmd.feed / 2) : 0;
  const toTame = !pat1 && !pat2 && !feed1 && !feed2;
  const actionRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setLabel(`x ${pat1}`)
      .setCustomId('pat1')
      .setStyle(pat1 ? ButtonStyle.Success : ButtonStyle.Secondary)
      .setEmoji(BOT_EMOJI.utils.heart)
      .setDisabled(true),
    new ButtonBuilder()
      .setLabel(`x ${feed1}`)
      .setCustomId('feed1')
      .setStyle(feed1 ? ButtonStyle.Success : ButtonStyle.Secondary)
      .setEmoji(BOT_EMOJI.utils.taco)
      .setDisabled(true)
  );
  const actionRow2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setLabel(`x ${pat2}`)
      .setCustomId('pat2')
      .setStyle(pat2 ? ButtonStyle.Success : ButtonStyle.Secondary)
      .setEmoji(BOT_EMOJI.utils.heart)
      .setDisabled(true),
    new ButtonBuilder()
      .setLabel(`x ${feed2}`)
      .setCustomId('feed2')
      .setStyle(feed2 ? ButtonStyle.Success : ButtonStyle.Secondary)
      .setEmoji(BOT_EMOJI.utils.taco)
      .setDisabled(true),
    new ButtonBuilder()
      .setLabel('tame')
      .setCustomId('tame')
      .setStyle(toTame ? ButtonStyle.Success : ButtonStyle.Secondary)
      .setDisabled(true)
      .setEmoji(BOT_EMOJI.pet.cat)
  );

  return [actionRow, actionRow2];
};

const MAX_CLICKS = 6;

const getCommands = (hunger: number, happiness: number, clicked: number) => {
  const feedAmount = getFeedTimes(hunger);
  let patAmount = getPatTimes(happiness, MAX_CLICKS - clicked - feedAmount);
  const list: ICmd[] = [];
  let loop = true;
  while (loop) {
    const percentage = generatePercentage(
      hunger,
      happiness,
      feedAmount,
      patAmount
    );
    if (percentage.min === 100 && list[0]?.isMax) {
      list.pop();
    }
    list.push({
      avg: percentage.avg,
      min: percentage.min,
      max: percentage.max,
      feed: feedAmount,
      pat: patAmount,
      isMax: percentage.min === 100,
    });
    if (percentage.min !== 100 || !patAmount) {
      loop = false;
      break;
    }
    patAmount--;
  }
  return list;
};

const getFeedTimes = (hunger: number) => {
  const feedTimes = Math.floor(hunger / 20);
  const remainingHunger = hunger % 20;
  return remainingHunger >= 10 ? feedTimes + 1 : feedTimes;
};

const getPatTimes = (happiness: number, max: number) => {
  for (let i = 0; i < max; i++) {
    if (happiness >= 100) {
      return i + 1;
    }
    happiness += 10;
  }
  return max;
};

const generatePercentage = (
  hunger: number,
  happiness: number,
  feedAmount: number,
  patAmount: number
) => {
  const min = calcPercentage(hunger, happiness, feedAmount, patAmount, 'min');
  const max = calcPercentage(hunger, happiness, feedAmount, patAmount, 'max');
  const avg = calcPercentage(hunger, happiness, feedAmount, patAmount, 'avg');
  return {
    min,
    max,
    avg,
  };
};

const hungerTimes = {
  min: 18,
  max: 22,
  avg: 20,
} as const;

const happinessTimes = {
  min: 8,
  max: 12,
  avg: 10,
} as const;

const calcPercentage = (
  hunger: number,
  happiness: number,
  feedAmount: number,
  patAmount: number,
  type: 'min' | 'max' | 'avg'
) => {
  const finalHunger = Math.max(0, hunger - feedAmount * hungerTimes[type]);
  const finalHappiness = Math.min(
    100,
    happiness + patAmount * happinessTimes[type]
  );
  const value = finalHappiness - finalHunger;
  return value >= 85 ? 100 : calcFinalPercentage(value);
};

const calcFinalPercentage = (petStats: number) => {
  const value = ((85 - petStats) * 35.3) / 30;
  return Math.round((100 - value) * 100) / 100;
};
