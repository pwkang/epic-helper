import {ActionRowBuilder, ButtonBuilder, ButtonStyle, User} from 'discord.js';

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
}

const CASINO_ANSWER_LIST = {
  'FOUR LEAF CLOVER': ':four_leaf_clover:',
  GIFT: ':gift:',
  DICE: ':game_die:',
  DIAMOND: ':gem:',
  COIN: ':coin:',
};

export default function getTrainingAnswer({
  content,
  author,
}: IGetTrainingAnswer): ActionRowBuilder<ButtonBuilder>[] {
  let components: ActionRowBuilder<ButtonBuilder>[] = [];
  if (content.match('is training in the river')) {
    if (content.match(':normiefish:')) components = generateRows(RIVER, 'normie');
    if (content.match(':goldenfish:')) components = generateRows(RIVER, 'golden');
    if (content.match(':EPICfish:')) components = generateRows(RIVER, 'epic');
  } else if (content.match('is training in the field')) {
    if (content.match(':Apple:')) {
      if (content.match('**first**')) components = generateRows(FIELD, 'A');
      if (content.match('**second**')) components = generateRows(FIELD, 'P');
      if (content.match('**third**')) components = generateRows(FIELD, 'P');
      if (content.match('**fourth**')) components = generateRows(FIELD, 'L');
      if (content.match('**fifth**')) components = generateRows(FIELD, 'E');
    } else if (content.match(':Banana:')) {
      if (content.match('**first**')) components = generateRows(FIELD, 'B');
      if (content.match('**second**')) components = generateRows(FIELD, 'A');
      if (content.match('**third**')) components = generateRows(FIELD, 'N');
      if (content.match('**fourth**')) components = generateRows(FIELD, 'A');
      if (content.match('**fifth**')) components = generateRows(FIELD, 'N');
      if (content.match('**sixth**')) components = generateRows(FIELD, 'A');
    }
  } else if (content.match('is training in the forest')) {
    const questionLogs = content.split('\n')[1].match(/<:[A-Za-z]+log:\d+>/g);
    const targetLog = content.split('\n')[2].match(/<:[A-Za-z]+log:\d+>/g);
    if (questionLogs && targetLog) {
      components = generateRows(FOREST, questionLogs.filter((log) => log === targetLog[0]).length);
    }
  } else if (content.match('is training in the... casino?')) {
    const matched = Object.entries(CASINO_ANSWER_LIST).some(
      ([key, value]) => content.split('\n')[1].match(value) && content.match(key)
    );
    components = generateRows(TRUE_FALSE, matched);
  } else if (content.match('in the mine')) {
    // TODO: calc user ruby amount
    components = generateRows(TRUE_FALSE, true);
  }
  return components;
}

function generateRows(list: ITrainingAnswer[], answer: TAnswerType) {
  let rows: ActionRowBuilder<ButtonBuilder>[] = [];
  for (let row of chunkInto3(list)) {
    let actionRow = new ActionRowBuilder<ButtonBuilder>();
    for (let item of row) {
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
      style ? (label === 'no' ? ButtonStyle.Danger : ButtonStyle.Success) : ButtonStyle.Secondary
    );
}

function chunkInto3(list: ITrainingAnswer[]): ITrainingAnswer[][] {
  let rows = [];
  for (let i = 0; i < list.length; i += 3) {
    rows.push(list.slice(i, i + 3));
  }
  return rows;
}
