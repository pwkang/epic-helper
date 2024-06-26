import type {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import embedReaders from '../../embed-readers';
import {userService} from '@epic-helper/services';

interface IRpgOpenLootbox {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgOpenLootbox({
  client,
  message,
  author,
  isSlashCommand,
}: IRpgOpenLootbox) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    author,
    client,
    channelId: message.channelId,
  });
  if (!event) return;
  event.on('embed', (embed) => {
    if (isLootboxOpen({embed, author})) {
      rpgOpenLootboxSuccess({embed, author});
      event?.stop();
    }
  });
  event.on('content', (content) => {
    if (isOpenTooMany({content})) {
      event?.stop();
    }
    if (isNotEnoughLootbox({content})) {
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgOpenLootboxSuccess {
  embed: Embed;
  author: User;
}

const rpgOpenLootboxSuccess = async ({
  embed,
  author,
}: IRpgOpenLootboxSuccess) => {
  const openedItems = embedReaders.lootbox({embed});
  if (openedItems.ruby) {
    await userService.updateUserRubyAmount({
      ruby: openedItems.ruby,
      type: 'inc',
      userId: author.id,
    });
  }
};

interface IIsLootboxOpened {
  author: User;
  embed: Embed;
}

const isLootboxOpen = ({embed, author}: IIsLootboxOpened) =>
  embed.author?.name === `${author.username} — lootbox` &&
  embed.fields[0]?.name.includes('opened!');

interface IIsNotEnoughLootbox {
  content: Message['content'];
}

const isOpenTooMany = ({content}: IIsNotEnoughLootbox) =>
  content.includes('You cannot open more than 100 lootboxes');

interface IIsNotEnoughLootbox {
  content: Message['content'];
}

const isNotEnoughLootbox = ({content}: IIsNotEnoughLootbox) =>
  content.includes('you don\'t have that many of this lootbox type');
