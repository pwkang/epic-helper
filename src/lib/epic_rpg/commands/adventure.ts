import {Client, Message, User} from 'discord.js';
import {ADVENTURE_MONSTER_LIST} from '../../../constants/monster';
import {saveUserAdventureCooldown} from '../../../models/user-reminder/user-reminder.service';
import ms from 'ms';

interface IRpgAdventure {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

const ADVENTURE_COOLDOWN = ms('1h');

export default async function rpgAdventure({author, content, client, channelId}: IRpgAdventure) {
  const hardMode = content.includes('(but stronger)');

  await saveUserAdventureCooldown({
    userId: author.id,
    hardMode,
    readyAt: new Date(Date.now() + ADVENTURE_COOLDOWN),
  });
}

interface ISuccessChecker {
  content: string;
  author: User;
}

export function isRpgAdventureSuccess({author, content}: ISuccessChecker) {
  return (
    content.includes(author.username) &&
    ADVENTURE_MONSTER_LIST.some((monster) => content.includes(monster))
  );
}
