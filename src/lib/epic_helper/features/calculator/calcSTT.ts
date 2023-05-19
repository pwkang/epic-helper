import {Embed, MessageCreateOptions, User} from 'discord.js';
import {RpgArea} from '../../../../types/rpg.types';

interface ICalcOptions {
  embed: Embed;
  area: RpgArea;
  author: User;
}

type TCalcFunc = (options: ICalcOptions) => MessageCreateOptions;

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
