import {Client, Message, User} from 'discord.js';
import {saveUserLootboxCooldown} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {LOOTBOX_TYPE} from '../../../../constants/lootbox';

const LOOTBOX_COOLDOWN = ms('3h');

interface IRpgBuyLootbox {
  client: Client;
  channelId: string;
  user: User;
  content: Message['content'];
}

export default async function rpgBuyLootbox({user, content}: IRpgBuyLootbox) {
  const lootboxType = Object.values(LOOTBOX_TYPE).find((type) =>
    content.toLowerCase().includes(type)
  );
  await saveUserLootboxCooldown({
    userId: user.id,
    readyAt: new Date(Date.now() + LOOTBOX_COOLDOWN),
    lootboxType,
  });
}

interface IIsLootboxSuccessfullyBought {
  content: Message['content'];
}

export const isLootboxSuccessfullyBought = ({content}: IIsLootboxSuccessfullyBought) =>
  content.includes('successfully bought for');
