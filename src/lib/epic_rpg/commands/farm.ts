import {Client, Message, User} from 'discord.js';
import {saveUserFarmCooldown} from '../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {RPG_FARM_SEED} from '../../../constants/rpg';

const FARM_COOLDOWN = ms('10m');

interface IRpgFarm {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

export default async function rpgFarm({content, client, channelId, author}: IRpgFarm) {
  const seedType = whatIsTheSeed(content);
  await saveUserFarmCooldown({
    userId: author.id,
    readyAt: new Date(Date.now() + FARM_COOLDOWN),
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
