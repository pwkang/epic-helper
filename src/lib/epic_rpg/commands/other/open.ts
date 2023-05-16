import {Embed, Message, User} from 'discord.js';
import scanLootbox from '../../../../utils/epic_rpg/scanLootbox';
import {updateUserRubyAmount} from '../../../../models/user/user.service';

interface IRpgOpenLootbox {
  embed: Embed;
  author: User;
}

const rpgOpenLootbox = async ({embed, author}: IRpgOpenLootbox) => {
  const openedItems = scanLootbox({embed});
  if (openedItems.ruby) {
    await updateUserRubyAmount({
      ruby: openedItems.ruby,
      type: 'inc',
      userId: author.id,
    });
  }
};

export default rpgOpenLootbox;

interface IIsLootboxOpened {
  author: User;
  embed: Embed;
}

export const isLootboxOpen = ({embed, author}: IIsLootboxOpened) =>
  embed.author?.name === `${author.username} — lootbox` &&
  embed.fields[0]?.name.includes('opened!');

interface IIsNotEnoughLootbox {
  content: Message['content'];
}

export const isOpenTooMany = ({content}: IIsNotEnoughLootbox) =>
  content.includes('You cannot open more than 100 lootboxes');

interface IIsNotEnoughLootbox {
  content: Message['content'];
}

export const isNotEnoughLootbox = ({content}: IIsNotEnoughLootbox) =>
  content.includes("you don't have that many of this lootbox type");
