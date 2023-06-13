import {Embed, EmbedBuilder, MessageCreateOptions, User} from 'discord.js';
import {BOT_COLOR} from '../../../../constants/epic_helper/general';
import {RPG_CLICKABLE_SLASH_COMMANDS} from '../../../../constants/epic_rpg/clickable_slash';
import {RpgArea} from '../../../../types/rpg.types';
import {BOT_EMOJI} from '../../../../constants/epic_helper/bot_emojis';
import tradeHelper from '../../../epic_rpg/inventory/rpgTraderHelper';
import {PREFIX} from '../../../../constants/bot';
import embedReaders from '../../../epic_rpg/embedReaders';

interface ICalcOptions {
  embed: Embed;
  area: RpgArea;
  author: User;
}

type TCalcFunc = (options: ICalcOptions) => MessageCreateOptions;

export const getCalcMaterialMessage: TCalcFunc = ({embed, area, author}) => {
  const inventory = embedReaders.inventory({embed});
  const a3Fish = tradeHelper.startTrading({
    startArea: area,
    endArea: 3,
    inventory,
    tradeTo: 'normieFish',
  }).normieFish;
  const a5Apple = tradeHelper.startTrading({
    startArea: area,
    endArea: 5,
    inventory,
    tradeTo: 'apple',
  }).apple;
  const a10Log = tradeHelper.startTrading({
    startArea: area,
    endArea: 10,
    inventory,
    tradeTo: 'woodenLog',
  }).woodenLog;
  const a11Apple = tradeHelper.startTrading({
    startArea: area,
    endArea: 11,
    inventory,
    tradeTo: 'apple',
  }).apple;
  const a12Ruby = tradeHelper.startTrading({
    startArea: area,
    endArea: 12,
    inventory,
    tradeTo: 'ruby',
  }).ruby;
  const topFish = tradeHelper.startTrading({
    startArea: area,
    endArea: 'top',
    inventory,
    tradeTo: 'normieFish',
  }).normieFish;
  const topLog = tradeHelper.startTrading({
    startArea: area,
    endArea: 'top',
    inventory,
    tradeTo: 'woodenLog',
  }).woodenLog;
  const topApple = tradeHelper.startTrading({
    startArea: area,
    endArea: 'top',
    inventory,
    tradeTo: 'apple',
  }).apple;
  const topRuby = tradeHelper.startTrading({
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

/**
 *  ==========================================
 *            List of Checker here
 *  ==========================================
 */

export const isCalcMaterial = (args: string[]) =>
  (!isNaN(Number(args[1])) || args[1] === 'top') && isNaN(Number(args[2]));

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
    content: `Use ${RPG_CLICKABLE_SLASH_COMMANDS.inventory} once`,
  };
};

const materialCalculator = {
  getCalcMaterialMessage,
  isCalcMaterial,
  getInvalidCalcArgsMessage,
  getCalcInstructionMessage,
};

export default materialCalculator;
