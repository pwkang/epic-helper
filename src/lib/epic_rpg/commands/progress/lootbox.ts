import {Client, Message, User} from 'discord.js';
import {
  saveUserLootboxCooldown,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_LOOTBOX_TYPE} from '../../../../constants/epic_rpg/lootbox';
import {BOT_REMINDER_BASE_COOLDOWN} from '../../../../constants/epic_helper/command_base_cd';
import {calcCdReduction} from '../../../epic_helper/reminders/commandsCooldown';
import {RPG_COMMAND_TYPE} from '../../../../constants/epic_rpg/rpg';
import {createRpgCommandListener} from '../../../../utils/createRpgCommandListener';
import {updateReminderChannel} from '../../../epic_helper/reminders/reminderChannel';
import {countUserStats} from '../../../../models/user-stats/user-stats.service';
import {USER_STATS_RPG_COMMAND_TYPE} from '../../../../models/user-stats/user-stats.types';

const LOOTBOX_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.lootbox;

interface IRpgLootbox {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgBuyLootbox({client, message, author, isSlashCommand}: IRpgLootbox) {
  const event = createRpgCommandListener({
    author,
    channelId: message.channel.id,
    client,
  });
  if (!event) return;
  event.on('content', (content, collected) => {
    if (isLootboxSuccessfullyBought({content})) {
      rpgBuyLootboxSuccess({
        author,
        client,
        channelId: message.channel.id,
        content,
      });
      event.stop();
    }
    if (isNotEligibleToBuyLootbox({message: collected, author})) {
      event.stop();
    }
    if (isNotEnoughMoneyToBuyLootbox({author, content})) {
      event.stop();
    }
  });
  event.on('cooldown', (cooldown) => {
    updateUserCooldown({
      type: RPG_COMMAND_TYPE.lootbox,
      readyAt: new Date(Date.now() + cooldown),
      userId: author.id,
    });
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgBuyLootboxSuccess {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

export default async function rpgBuyLootboxSuccess({
  author,
  content,
  channelId,
}: IRpgBuyLootboxSuccess) {
  const lootboxType = Object.values(RPG_LOOTBOX_TYPE).find((type) =>
    content.toLowerCase().includes(type)
  );
  const cooldown = await calcCdReduction({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.lootbox,
    cooldown: LOOTBOX_COOLDOWN,
  });
  await saveUserLootboxCooldown({
    userId: author.id,
    readyAt: new Date(Date.now() + cooldown),
    lootboxType,
  });
  updateReminderChannel({
    userId: author.id,
    channelId,
  });

  countUserStats({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.lootbox,
  });
}

interface IIsLootboxSuccessfullyBought {
  content: Message['content'];
}

export const isLootboxSuccessfullyBought = ({content}: IIsLootboxSuccessfullyBought) =>
  Object.values(RPG_LOOTBOX_TYPE).some((lb) => content.toLowerCase().includes(lb)) &&
  content.includes('successfully bought for');

interface IIsNotEligibleToBuyLootbox {
  message: Message;
  author: User;
}

export const isNotEligibleToBuyLootbox = ({message, author}: IIsNotEligibleToBuyLootbox) =>
  message.mentions.has(author.id) && message.content.includes('to buy this lootbox');

interface IIsNotEnoughMoneyToBuyLootbox {
  content: Message['content'];
  author: User;
}

export const isNotEnoughMoneyToBuyLootbox = ({content}: IIsNotEnoughMoneyToBuyLootbox) =>
  content.includes("You don't have enough money");
