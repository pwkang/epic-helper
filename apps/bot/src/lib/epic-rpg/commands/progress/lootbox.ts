import {
  BOT_REMINDER_BASE_COOLDOWN,
  RPG_COMMAND_TYPE,
  RPG_COOLDOWN_EMBED_TYPE,
  RPG_LOOTBOX_TYPE,
} from '@epic-helper/constants';
import {Client, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {userStatsService} from '../../../../services/database/user-stats.service';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';

const LOOTBOX_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.lootbox;

interface IRpgLootbox {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgBuyLootbox({client, message, author, isSlashCommand}: IRpgLootbox) {
  if (!message.inGuild()) return;
  const event = createRpgCommandListener({
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
  event.on('cooldown', async (cooldown) => {
    await userReminderServices.updateUserCooldown({
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

const rpgBuyLootboxSuccess = async ({author, content, channelId}: IRpgBuyLootboxSuccess) => {
  const toggleChecker = await toggleUserChecker({userId: author.id});
  if (!toggleChecker) return;
  const lootboxType = Object.values(RPG_LOOTBOX_TYPE).find((type) =>
    content.toLowerCase().includes(type)
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
    userId: author.id,
    channelId,
  });

  await userStatsService.countUserStats({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.lootbox,
  });
};

interface IIsLootboxSuccessfullyBought {
  content: Message['content'];
}

const isLootboxSuccessfullyBought = ({content}: IIsLootboxSuccessfullyBought) =>
  Object.values(RPG_LOOTBOX_TYPE).some((lb) => content.toLowerCase().includes(lb)) &&
  content.includes('successfully bought for');

interface IIsNotEligibleToBuyLootbox {
  message: Message;
  author: User;
}

const isNotEligibleToBuyLootbox = ({message, author}: IIsNotEligibleToBuyLootbox) =>
  message.mentions.has(author.id) && message.content.includes('to buy this lootbox');

interface IIsNotEnoughMoneyToBuyLootbox {
  content: Message['content'];
  author: User;
}

const isNotEnoughMoneyToBuyLootbox = ({content}: IIsNotEnoughMoneyToBuyLootbox) =>
  content.includes('You don\'t have enough money');
