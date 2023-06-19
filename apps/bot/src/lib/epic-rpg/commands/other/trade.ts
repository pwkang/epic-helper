import {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {userService} from '@epic-helper/models';
import {RPG_ITEMS} from '@epic-helper/constants';

interface IRpgSuccess {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgTrade = ({client, message, author, isSlashCommand}: IRpgSuccess) => {
  const event = createRpgCommandListener({
    author,
    channelId: message.channelId,
    client,
  });
  if (!event) return;
  event.on('embed', (embed) => {
    if (isRpgTrade({embed, author})) {
      rpgTradeSuccess({embed, author});
      event.stop();
    }
  });
  event.on('content', (content, collected) => {
    if (isNotEnoughItems({message: collected, author})) {
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgTradeSuccess {
  embed: Embed;
  author: User;
}

const rpgTradeSuccess = async ({embed, author}: IRpgTradeSuccess) => {
  const traded = extractTradedItems({embed, author});
  if (!traded.ruby) return;
  await userService.updateUserRubyAmount({
    userId: author.id,
    ruby: Math.abs(traded.ruby),
    type: traded.ruby > 0 ? 'inc' : 'dec',
  });
};

interface IExtractTradedItems {
  embed: Embed;
  author: User;
}

type ITradedItem = {
  [key in keyof typeof RPG_ITEMS]?: number;
};
const extractTradedItems = ({embed}: IExtractTradedItems): ITradedItem => {
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

const isRpgTrade = ({embed, author}: IIsRpgTrade) =>
  embed.description?.includes('Our trade is done then') &&
  embed.fields[0]?.value.includes(author.username);

interface IIsNotEnoughItems {
  message: Message;
  author: User;
}

const isNotEnoughItems = ({author, message}: IIsNotEnoughItems) =>
  message.content.includes("you don't have enough") && message.mentions.has(author.id);
