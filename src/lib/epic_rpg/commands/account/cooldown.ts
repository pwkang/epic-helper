import {Embed, Message, User} from 'discord.js';
import {
  deleteUserCooldowns,
  getUserAllCooldowns,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';

const isReady = (str: string) => str.includes(':white_check_mark:');

const RPG_COMMAND_CATEGORY = {
  daily: ['daily'],
  weekly: ['weekly'],
  lootbox: ['lootbox'],
  vote: ['vote'],
  hunt: ['hunt'],
  adventure: ['adventure'],
  training: ['training', 'ultraining'],
  duel: ['duel'],
  quest: ['quest', 'epic quest'],
  working: [
    'fish',
    'net',
    'boat',
    'bigboat',
    'chop',
    'axe',
    'bowsaw',
    'chainsaw',
    'mine',
    'pickaxe',
    'drill',
    'dynamite',
  ],
  farm: ['farm'],
  horse: ['horse breeding', 'horse race'],
  arena: ['arena', 'big arena'],
  dungeon: ['dungeon', 'minintboss'],
};

interface IRpgCooldown {
  embed: Embed;
  author: User;
}

export default async function rpgCooldown({author, embed}: IRpgCooldown) {
  const currentCooldowns = await getUserAllCooldowns(author.id);

  const fields = embed.fields.flatMap((field) => field.value.split('\n'));

  for (let row of fields) {
    const commandList = row
      .toLowerCase()
      .split('`')[1]
      .split('|')
      .map((str) => str.trim())
      .flatMap((str) => str);
    const commandType = Object.entries(RPG_COMMAND_CATEGORY).find(([key, value]) =>
      value.some((command) => commandList.some((name) => name.includes(command)))
    )?.[0] as keyof typeof RPG_COMMAND_CATEGORY;
    if (isReady(row)) {
      if (currentCooldowns.some((cooldown) => cooldown.type === commandType)) {
        await deleteUserCooldowns({
          types: [commandType],
          userId: author.id,
        });
      }
    } else {
      const timeLeftList = row.split('(**')[1].split('**)')[0].split(' ');
      const timeLeft = timeLeftList.reduce((acc, cur) => {
        return acc + ms(cur);
      }, 0);
      const readyAt = new Date(Date.now() + timeLeft);
      const currentCooldown = currentCooldowns.find((cooldown) => cooldown.type === commandType);
      if (currentCooldown) {
        if (Math.abs(currentCooldown.readyAt.getTime() - readyAt.getTime()) > 1000) {
          await updateUserCooldown({
            userId: author.id,
            type: commandType,
            readyAt,
          });
        }
      } else {
        await updateUserCooldown({
          userId: author.id,
          type: commandType,
          readyAt,
        });
      }
    }
  }
}

interface IIsRpgCooldownResponse {
  embed: Embed;
  author: User;
}

export const isRpgCooldownResponse = ({embed, author}: IIsRpgCooldownResponse) =>
  embed.author?.name === `${author.username} — cooldowns`;
