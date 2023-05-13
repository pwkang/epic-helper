import {RPG_WORKING_TYPE} from '../../../../constants/rpg';
import {Client, User} from 'discord.js';
import {saveUserWorkingCooldown} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';

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

const WORKING_COOLDOWN = ms('5m');

interface IRpgWorking {
  client: Client;
  channelId: string;
  author: User;
  workingType?: ValuesOf<typeof RPG_WORKING_TYPE>;
}

export default async function rpgWorking({author, workingType}: IRpgWorking) {
  await saveUserWorkingCooldown({
    userId: author.id,
    workingType,
    readyAt: new Date(Date.now() + WORKING_COOLDOWN),
  });
}

interface IIsRpgWorkingSuccess {
  content: string;
  author: User;
}

export const isRpgWorkingSuccess = ({author, content}: IIsRpgWorkingSuccess) =>
  content.includes(author.username) && WORKING_ITEMS.some((item) => content.includes(item));
