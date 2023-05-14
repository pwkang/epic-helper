import {Client, Message, User} from 'discord.js';
import {saveUserFarmCooldown} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {RPG_COMMAND_TYPE, RPG_FARM_SEED} from '../../../../constants/rpg';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';

const FARM_COOLDOWN = COMMAND_BASE_COOLDOWN.farm;

interface IRpgFarm {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

export default async function rpgFarm({content, author}: IRpgFarm) {
  const seedType = whatIsTheSeed(content);
  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.farm,
    cooldown: FARM_COOLDOWN,
  });
  await saveUserFarmCooldown({
    userId: author.id,
    readyAt: new Date(Date.now() + cooldown),
    seedType,
  });
}

interface IIsRpgFarmSuccess {
  content: string;
  author: User;
}

export const isRpgFarmSuccess = ({author, content}: IIsRpgFarmSuccess) =>
  content.includes(author.username) &&
  ['have grown from the seed', 'HITS THE FLOOR WITH THE FISTS', 'in the ground...'].some((msg) =>
    content.includes(msg)
  );

function whatIsTheSeed(content: string) {
  return Object.values(RPG_FARM_SEED).find((seed) => seed && content.split('\n')[0].includes(seed));
}
