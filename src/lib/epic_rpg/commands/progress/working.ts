import {RPG_COMMAND_TYPE, RPG_WORKING_TYPE} from '../../../../constants/rpg';
import {Client, Embed, User} from 'discord.js';
import {saveUserWorkingCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';

const WORKING_ITEMS = [
  'normie fish',
  'golden fish',
  'epic fish',
  'wooden log',
  'epic log',
  'super log',
  'mega',
  'hyper',
  'ultra',
  'apple',
  'banana',
  'ruby',
  'coins',
  'rubies',
  'nothing',
];

const WORKING_COOLDOWN = COMMAND_BASE_COOLDOWN.working;

interface IRpgWorking {
  client: Client;
  channelId: string;
  author: User;
  workingType?: ValuesOf<typeof RPG_WORKING_TYPE>;
}

export default async function rpgWorking({author, workingType}: IRpgWorking) {
  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.working,
    cooldown: WORKING_COOLDOWN,
  });
  await saveUserWorkingCooldown({
    userId: author.id,
    workingType,
    readyAt: new Date(Date.now() + cooldown),
  });
}

interface IIsRpgWorkingSuccess {
  content: string;
  author: User;
}

export const isRpgWorkingSuccess = ({author, content}: IIsRpgWorkingSuccess) =>
  content.includes(author.username) &&
  WORKING_ITEMS.some((item) => content.toLowerCase().includes(item));

interface IIsWorkingInSpace {
  content: string;
  author: User;
}

export const isWorkingInSpace = ({author, content}: IIsWorkingInSpace) =>
  [
    'no trees to chop',
    'what are you going to mine?',
    'you can\'t pick "up" stuff',
    'there are fish in space',
  ].some((msg) => content.includes(msg));

interface IIsRubyMined {
  content: string;
  author: User;
}

export const isRubyMined = ({content, author}: IIsRubyMined) =>
  [author.username, 'GOT', '<:ruby:603456286184701953>'].every((msg) => content.includes(msg));

interface IRubyAmountMined {
  content: string;
  author: User;
}

export const rubyAmountMined = ({content, author}: IRubyAmountMined) => {
  const regex = new RegExp('GOT (\\d+) <:ruby:603456286184701953>');
  const match = content.match(regex);
  return match ? parseInt(match[1]) : 0;
};

interface IIsEncounteringRubyDragon {
  embed: Embed;
  author: User;
}

export const isEncounteringRubyDragon = ({embed, author}: IIsEncounteringRubyDragon) =>
  embed.description?.includes('No matter how much you look around') &&
  embed.author?.name.includes(author.username);

interface IIsFoughtRubyDragon {
  content: string;
  author: User;
}

export const isFoughtRubyDragon = ({content, author}: IIsFoughtRubyDragon) =>
  [author.username, 'fights', 'THE RUBY DRAGON'].every((msg) => content.includes(msg));
