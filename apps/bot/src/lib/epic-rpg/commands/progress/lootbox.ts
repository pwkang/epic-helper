import {
  BOT_REMINDER_BASE_COOLDOWN,
  RPG_COMMAND_TYPE,
  RPG_COOLDOWN_EMBED_TYPE,
  RPG_LOOTBOX_TYPE,
} from '@epic-helper/constants';
import type {Client, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';
import commandHelper from '../../../epic-helper/command-helper';
import {userReminderServices} from '@epic-helper/services';

const LOOTBOX_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.lootbox;

interface IRpgLootbox {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgBuyLootbox({
  client,
  message,
  author,
  isSlashCommand,
}: IRpgLootbox) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    author,
    channelId: message.channel.id,
    client,
    commandType: RPG_COOLDOWN_EMBED_TYPE.lootbox,
  });
  if (!event) return;
  event.on('content', async (content, collected) => {
    if (isLootboxSuccessfullyBought({content})) {
      await rpgBuyLootboxSuccess({
        author,
        client,
        content,
        message,
      });
      event?.stop();
    }
    if (isNotEligibleToBuyLootbox({message: collected, author})) {
      event?.stop();
    }
    if (isNotEnoughMoneyToBuyLootbox({author, content})) {
      event?.stop();
    }
  });
  event.on('cooldown', async (cooldown) => {
    const toggleUser = await toggleUserChecker({
      userId: author.id,
      serverId: message.guild.id,
      client,
    });
    if (!toggleUser?.reminder.lootbox) return;
    await userReminderServices.updateUserCooldown({
      type: RPG_COMMAND_TYPE.lootbox,
      readyAt: new Date(Date.now() + cooldown),
      userId: author.id,
    });
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgBuyLootboxSuccess {
  client: Client;
  author: User;
  content: Message['content'];
  message: Message<true>;
}

const rpgBuyLootboxSuccess = async ({
  author,
  content,
  message,
  client,
}: IRpgBuyLootboxSuccess) => {
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    serverId: message.guild.id,
    client,
  });
  if (!toggleChecker) return;
  const lootboxType = Object.values(RPG_LOOTBOX_TYPE).find((type) =>
    content.toLowerCase().includes(type),
  );

  if (toggleChecker.reminder.lootbox) {
    const cooldown = await calcCdReduction({
      userId: author.id,
      commandType: RPG_COMMAND_TYPE.lootbox,
      cooldown: LOOTBOX_COOLDOWN,
    });
    await userReminderServices.saveUserLootboxCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      lootboxType,
    });
  }

  await updateReminderChannel({
    client,
    userId: author.id,
    channelId: message.channel.id,
  });

  commandHelper.userStats.countCommand({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.lootbox,
  });
};

interface IIsLootboxSuccessfullyBought {
  content: Message['content'];
}

const isLootboxSuccessfullyBought = ({content}: IIsLootboxSuccessfullyBought) =>
  Object.values(RPG_LOOTBOX_TYPE).some((lb) =>
    content.toLowerCase().includes(lb),
  ) && content.includes('successfully bought for');

interface IIsNotEligibleToBuyLootbox {
  message: Message;
  author: User;
}

const isNotEligibleToBuyLootbox = ({
  message,
  author,
}: IIsNotEligibleToBuyLootbox) =>
  message.mentions.has(author.id) &&
  message.content.includes('to buy this lootbox');

interface IIsNotEnoughMoneyToBuyLootbox {
  content: Message['content'];
  author: User;
}

const isNotEnoughMoneyToBuyLootbox = ({
  content,
}: IIsNotEnoughMoneyToBuyLootbox) =>
  content.includes('You don\'t have enough money');
