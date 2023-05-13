import {Client, Message, User} from 'discord.js';
import {HUNT_MONSTER_LIST} from '../../../../constants/monster';
import {saveUserHuntCooldown} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';

interface IRpgHunt {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

const HUNT_COOLDOWN = ms('1m');

export default async function rpgHunt({author, content}: IRpgHunt) {
  const hardMode = content.includes('(but stronger)');
  const together = content.includes('hunting together');

  await saveUserHuntCooldown({
    userId: author.id,
    hardMode,
    together,
    readyAt: new Date(Date.now() + HUNT_COOLDOWN),
  });
}

interface ISuccessChecker {
  content: string;
  author: User;
}

export function isRpgHuntSuccess({author, content}: ISuccessChecker) {
  return (
    content.includes(author.username) &&
    HUNT_MONSTER_LIST.some((monster) => content.includes(monster))
  );
}
