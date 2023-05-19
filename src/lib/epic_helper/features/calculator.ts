import {Embed, EmbedBuilder, MessageCreateOptions, User} from 'discord.js';
import {BOT_COLOR, PREFIX} from '../../../constants/bot';
import {CLICKABLE_SLASH_RPG} from '../../../constants/clickable_slash';
import scanInventory from '../../../utils/epic_rpg/inventory/scanInventory';
import {RpgArea} from '../../../types/rpg.types';
import {BOT_EMOJI} from '../../../constants/bot_emojis';
import {startTrading} from '../../../utils/epic_rpg/inventory/tradeMaterials';

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
