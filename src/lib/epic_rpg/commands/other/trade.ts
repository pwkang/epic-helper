import {Embed, Message, User} from 'discord.js';
import {RPG_ITEMS} from '../../../../constants/rpg_items';
import {updateUserRubyAmount} from '../../../../models/user/user.service';

interface IRpgTrade {
  embed: Embed;
  author: User;
}

const rpgTrade = async ({embed, author}: IRpgTrade) => {
  const traded = extractTradedItems({embed, author});
  if (!traded.ruby) return;
  await updateUserRubyAmount({
    userId: author.id,
    ruby: Math.abs(traded.ruby),
    type: traded.ruby > 0 ? 'inc' : 'dec',
  });
};

export default rpgTrade;

interface IExtractTradedItems {
  embed: Embed;
  author: User;
}

type ITradedItem = {
  [key in keyof typeof RPG_ITEMS]?: number;
};
const extractTradedItems = ({embed, author}: IExtractTradedItems): ITradedItem => {
  const items = embed.fields[0].value.split('\n');

  const tradedItemName = Object.entries(RPG_ITEMS).find(([_, item]) =>
    items[0].includes(item.replaceAll(' ', ''))
  )?.[0] as keyof typeof RPG_ITEMS;
  const tradeItemAmount = (items[0].match(/x[\d,]+/)?.[0] ?? 'x0')
    .replaceAll('x', '')
    .replaceAll(',', '');
  const itemGetName = Object.entries(RPG_ITEMS).find(([_, item]) =>
    items[1].includes(item.replaceAll(' ', ''))
  )?.[0] as keyof typeof RPG_ITEMS;
  const itemGetAmount = (items[1].match(/x[\d,]+/)?.[0] ?? 'x0')
    .replaceAll('x', '')
    .replaceAll(',', '');

  return {
    [tradedItemName]: -tradeItemAmount,
    [itemGetName]: +itemGetAmount,
  };
};

interface IIsRpgTrade {
  author: User;
  embed: Embed;
}

export const isRpgTrade = ({embed, author}: IIsRpgTrade) =>
  embed.description?.includes('Our trade is done then') &&
  embed.fields[0]?.value.includes(author.username);

interface IIsNotEnoughItems {
  message: Message;
  author: User;
}

export const isNotEnoughItems = ({author, message}: IIsNotEnoughItems) =>
  message.content.includes("you don't have enough") && message.mentions.has(author.id);