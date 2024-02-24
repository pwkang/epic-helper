import type {Client, Embed, EmbedField, Message, User} from 'discord.js';
import ms from 'ms';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {calcExtraHuntCdWithPartner} from '../../../epic-helper/reminders/commands-cooldown';
import {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {userReminderServices} from '@epic-helper/services';
import {userService} from '@epic-helper/services';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';

const RPG_COMMAND_CATEGORY = {
  daily: ['daily'],
  weekly: ['weekly'],
  lootbox: ['lootbox'],
  cardHand: ['card hand'],
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
  dungeon: ['dungeon', 'miniboss', 'minintboss'],
};

interface IRpgCooldown {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgCooldown = ({
  client,
  message,
  author,
  isSlashCommand,
}: IRpgCooldown) => {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
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
        message,
        client,
      });
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgCooldownSuccess {
  embed: Embed;
  author: User;
  client: Client;
  message: Message<true>;
}

const rpgCooldownSuccess = async ({
  author,
  embed,
  message,
  client,
}: IRpgCooldownSuccess) => {
  const currentCooldowns = await userReminderServices.getUserAllCooldowns(
    author.id,
  );
  const userAccount = await userService.getUserAccount(author.id);
  if (!userAccount) return;

  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
  if (!toggleChecker) return;

  const fields = embed.fields.flatMap((field) => field.value.split('\n'));

  for (const row of fields) {
    const commandType = searchCommandType(row);

    if (isReady(row)) {
      if (currentCooldowns.some((cooldown) => cooldown.type === commandType)) {
        await userReminderServices.updateRemindedCooldowns({
          types: [commandType],
          userId: author.id,
        });
      }
    } else {
      let readyIn = extractAndCalculateReadyAt(row);
      if (commandType === RPG_COMMAND_TYPE.hunt && userAccount.config.donorP) {
        const extraDuration = calcExtraHuntCdWithPartner({
          donorP: userAccount.config.donorP,
          donor: userAccount.config.donor,
        });
        readyIn += extraDuration;
      }
      if (!toggleChecker.reminder[commandType]) readyIn = 0;

      if(commandType === 'cardHand') {
        readyIn = 3000;
      }

      const readyAt = new Date(Date.now() + readyIn);
      const currentCooldown = currentCooldowns.find(
        (cooldown) => cooldown.type === commandType,
      );
      if (
        !currentCooldown?.readyAt ||
        (
          currentCooldown?.readyAt &&
          Math.abs(currentCooldown.readyAt.getTime() - readyAt.getTime()) > 1000
        )
      ) {
        await userReminderServices.updateUserCooldown({
          userId: author.id,
          type: commandType,
          readyAt,
        });
      }
    }
  }
};

interface IIsRpgCooldownResponse {
  embed: Embed;
  author: User;
}

const isRpgCooldownResponse = ({embed, author}: IIsRpgCooldownResponse) =>
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

  return Object.entries(RPG_COMMAND_CATEGORY).find(([, value]) =>
    value.some((command) => commandList.some((name) => name.includes(command))),
  )?.[0] as keyof typeof RPG_COMMAND_CATEGORY;
};

const extractAndCalculateReadyAt = (fieldRow: string) => {
  const timeLeftList = fieldRow.match(/\*\*([\w\s]+)\*\*/)?.[1]?.split(' ') ?? [];
  return timeLeftList.reduce((acc, cur) => {
    return acc + ms(cur);
  }, 0);
};

const isReady = (str: string) => str.includes(':white_check_mark:');
