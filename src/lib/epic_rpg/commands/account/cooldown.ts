import {Client, Embed, EmbedField, Message, User} from 'discord.js';
import {
  deleteUserCooldowns,
  getUserAllCooldowns,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {getUserAccount} from '../../../../models/user/user.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/epic_rpg/rpg';
import {createRpgCommandListener} from '../../createRpgCommandListener';
import {calcExtraHuntCdWithPartner} from '../../../epic_helper/reminders/commandsCooldown';

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
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgCooldown({client, message, author, isSlashCommand}: IRpgCooldown) {
  const event = createRpgCommandListener({
    client,
    channelId: message.channel.id,
    author,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isRpgCooldownResponse({embed, author})) {
      await rpgCooldownSuccess({
        author,
        embed,
      });
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgCooldownSuccess {
  embed: Embed;
  author: User;
}

export default async function rpgCooldownSuccess({author, embed}: IRpgCooldownSuccess) {
  const currentCooldowns = await getUserAllCooldowns(author.id);
  const userProfile = await getUserAccount(author.id);
  if (!userProfile) return;

  const fields = embed.fields.flatMap((field) => field.value.split('\n'));

  for (let row of fields) {
    const commandType = searchCommandType(row);

    if (isReady(row)) {
      if (currentCooldowns.some((cooldown) => cooldown.type === commandType)) {
        await deleteUserCooldowns({
          types: [commandType],
          userId: author.id,
        });
      }
    } else {
      let readyIn = extractAndCalculateReadyAt(row);
      if (commandType === RPG_COMMAND_TYPE.hunt && userProfile.config.donorP) {
        const extraDuration = calcExtraHuntCdWithPartner({
          donorP: userProfile.config.donorP,
          donor: userProfile.config.donor,
        });
        readyIn += extraDuration;
      }
      const readyAt = new Date(Date.now() + readyIn);
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

const extractCommandsCooldown = (embedRow: EmbedField['value']) =>
  embedRow
    .toLowerCase()
    .split('`')[1]
    .split('|')
    .map((str) => str.trim())
    .flatMap((str) => str);

const searchCommandType = (fieldRow: string) => {
  const commandList = extractCommandsCooldown(fieldRow);

  return Object.entries(RPG_COMMAND_CATEGORY).find(([_, value]) =>
    value.some((command) => commandList.some((name) => name.includes(command)))
  )?.[0] as keyof typeof RPG_COMMAND_CATEGORY;
};

const extractAndCalculateReadyAt = (fieldRow: string) => {
  const timeLeftList = fieldRow.split('(**')[1].split('**)')[0].split(' ');
  return timeLeftList.reduce((acc, cur) => {
    return acc + ms(cur);
  }, 0);
};
