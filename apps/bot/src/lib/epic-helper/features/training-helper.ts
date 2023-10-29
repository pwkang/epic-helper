import type {Client, User} from 'discord.js';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';
import {userService} from '../../../services/database/user.service';
import toggleUserChecker from '../toggle-checker/user';

type TAnswerType = string | number | boolean;

interface ITrainingAnswer {
  label: string;
  ans: TAnswerType;
}

const FOREST: ITrainingAnswer[] = [
  {label: '0', ans: 0},
  {label: '1', ans: 1},
  {label: '2', ans: 2},
  {label: '3', ans: 3},
  {label: '4', ans: 4},
  {label: '5', ans: 5},
];

const FIELD: ITrainingAnswer[] = [
  {label: 'A', ans: 'A'},
  {label: 'B', ans: 'B'},
  {label: 'E', ans: 'E'},
  {label: 'L', ans: 'L'},
  {label: 'N', ans: 'N'},
  {label: 'P', ans: 'P'},
];

const RIVER: ITrainingAnswer[] = [
  {label: 'normie fish', ans: 'normie'},
  {label: 'golden fish', ans: 'golden'},
  {label: 'EPIC fish', ans: 'epic'},
];

const TRUE_FALSE: ITrainingAnswer[] = [
  {label: 'yes', ans: true},
  {label: 'no', ans: false},
];

interface IGetTrainingAnswer {
  content: string;
  author: User;
  client: Client;
  serverId: string;
}

const CASINO_ANSWER_LIST = {
  'FOUR LEAF CLOVER': ':four_leaf_clover:',
  GIFT: ':gift:',
  DICE: ':game_die:',
  DIAMOND: ':gem:',
  COIN: ':coin:',
};

export default async function getTrainingAnswer({
  content,
  author,
  serverId,
  client,
}: IGetTrainingAnswer): Promise<ActionRowBuilder<ButtonBuilder>[] | null> {
  let components: ActionRowBuilder<ButtonBuilder>[] = [];
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId,
  });
  if (!toggleChecker) return null;

  if (content.includes('is training in the river')) {
    if (!toggleChecker?.trainingBasic) return null;

    if (content.includes(':normiefish:'))
      components = generateRows(RIVER, 'normie');
    if (content.includes(':goldenfish:'))
      components = generateRows(RIVER, 'golden');
    if (content.includes(':EPICfish:'))
      components = generateRows(RIVER, 'epic');
  } else if (content.includes('is training in the field')) {
    if (!toggleChecker?.trainingBasic) return null;

    if (content.includes(':Apple:')) {
      if (content.includes('**first**')) components = generateRows(FIELD, 'A');
      if (content.includes('**second**')) components = generateRows(FIELD, 'P');
      if (content.includes('**third**')) components = generateRows(FIELD, 'P');
      if (content.includes('**fourth**')) components = generateRows(FIELD, 'L');
      if (content.includes('**fifth**')) components = generateRows(FIELD, 'E');
    } else if (content.includes(':Banana:')) {
      if (content.includes('**first**')) components = generateRows(FIELD, 'B');
      if (content.includes('**second**')) components = generateRows(FIELD, 'A');
      if (content.includes('**third**')) components = generateRows(FIELD, 'N');
      if (content.includes('**fourth**')) components = generateRows(FIELD, 'A');
      if (content.includes('**fifth**')) components = generateRows(FIELD, 'N');
      if (content.includes('**sixth**')) components = generateRows(FIELD, 'A');
    }
  } else if (content.includes('is training in the forest')) {
    if (!toggleChecker?.trainingBasic) return null;

    const questionLogs = content.split('\n')[1].match(/<:[A-Za-z]+log:\d+>/g);
    const targetLog = content.split('\n')[2].match(/<:[A-Za-z]+log:\d+>/g);
    if (questionLogs && targetLog) {
      components = generateRows(
        FOREST,
        questionLogs.filter((log) => log === targetLog[0]).length,
      );
    }
  } else if (content.includes('is training in the... casino?')) {
    if (!toggleChecker?.trainingBasic) return null;

    const matched = Object.entries(CASINO_ANSWER_LIST).some(
      ([key, value]) =>
        content.split('\n')[1].includes(value) && content.includes(key),
    );
    components = generateRows(TRUE_FALSE, matched);
  } else if (content.includes('in the mine')) {
    if (!toggleChecker?.trainingRuby) return null;

    const questionRuby = Number(content.match(/more than (\d+) </)?.[1] ?? 0);
    const userRuby = await userService.getUserRubyAmount(author.id);
    components = generateRows(TRUE_FALSE, userRuby > questionRuby);
  }
  return components;
}

function generateRows(list: ITrainingAnswer[], answer: TAnswerType) {
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  for (const row of chunkInto3(list)) {
    const actionRow = new ActionRowBuilder<ButtonBuilder>();
    for (const item of row) {
      actionRow.addComponents(generateButton(item.label, item.ans === answer));
    }
    rows.push(actionRow);
  }
  return rows;
}

function generateButton(label: string, style: boolean) {
  return new ButtonBuilder()
    .setLabel(label)
    .setCustomId(label)
    .setDisabled(true)
    .setStyle(
      style
        ? label === 'no'
          ? ButtonStyle.Danger
          : ButtonStyle.Success
        : ButtonStyle.Secondary,
    );
}

function chunkInto3(list: ITrainingAnswer[]): ITrainingAnswer[][] {
  const rows = [];
  for (let i = 0; i < list.length; i += 3) {
    rows.push(list.slice(i, i + 3));
  }
  return rows;
}
