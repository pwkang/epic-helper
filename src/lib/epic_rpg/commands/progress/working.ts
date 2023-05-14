import {RPG_COMMAND_TYPE, RPG_WORKING_TYPE} from '../../../../constants/rpg';
import {Client, User} from 'discord.js';
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
  content.includes(author.username) && WORKING_ITEMS.some((item) => content.includes(item));
