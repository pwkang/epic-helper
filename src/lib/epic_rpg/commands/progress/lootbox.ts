import {Client, Message, User} from 'discord.js';
import {saveUserLootboxCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {LOOTBOX_TYPE} from '../../../../constants/lootbox';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

const LOOTBOX_COOLDOWN = COMMAND_BASE_COOLDOWN.lootbox;

interface IRpgBuyLootbox {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

export default async function rpgBuyLootbox({author, content}: IRpgBuyLootbox) {
  const lootboxType = Object.values(LOOTBOX_TYPE).find((type) =>
    content.toLowerCase().includes(type)
  );
  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.lootbox,
    cooldown: LOOTBOX_COOLDOWN,
  });
  await saveUserLootboxCooldown({
    userId: author.id,
    readyAt: new Date(Date.now() + cooldown),
    lootboxType,
  });
}

interface IIsLootboxSuccessfullyBought {
  content: Message['content'];
}

export const isLootboxSuccessfullyBought = ({content}: IIsLootboxSuccessfullyBought) =>
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
