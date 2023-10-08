import {Client, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {RPG_EQUIPMENTS} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';
import {typedObjectEntries} from '@epic-helper/utils';

const rubyConsumed = {
  [RPG_EQUIPMENTS.rubySword]: 4,
  [RPG_EQUIPMENTS.rubyArmor]: 7,
  [RPG_EQUIPMENTS.coinSword]: 4,
};

interface IRpgCraft {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgCraft({client, message, author, isSlashCommand}: IRpgCraft) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
  });
  if (!event) return;
  event.on('content', async (content) => {
    if (isSuccessfullyCrafted({content})) {
      await rpgCraftSuccess({
        author,
        content,
      });
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgCraftSuccess {
  content: Message['content'];
  author: User;
}

const rpgCraftSuccess = async ({content, author}: IRpgCraftSuccess) => {
  const item = typedObjectEntries(RPG_EQUIPMENTS).find(([, item]) =>
    content.toLowerCase().includes(item)
  )?.[1] as keyof typeof RPG_EQUIPMENTS;
  if (!item) return;

  if (Object.keys(rubyConsumed).includes(item)) {
    const _item = item as keyof typeof rubyConsumed;
    let ruby = rubyConsumed[_item];
    if (isReturnPortionRecipes({content})) {
      const rate = extractReturnPortionRecipes({content});
      if (rate) {
        ruby -= Math.ceil(ruby * (Number(rate) / 100));
      }
    }
    await userService.updateUserRubyAmount({
      type: 'dec',
      userId: author.id,
      ruby,
    });
  }
};

interface IIsSuccessfullyCrafted {
  content: Message['content'];
}

const isSuccessfullyCrafted = ({content}: IIsSuccessfullyCrafted) =>
  content.includes('successfully crafted!');

interface IIsReturnPortionRecipes {
  content: Message['content'];
}

const isReturnPortionRecipes = ({content}: IIsReturnPortionRecipes) =>
  content.includes('of the recipe back');

interface IExtractReturnPortionRecipes {
  content: Message['content'];
}

const extractReturnPortionRecipes = ({content}: IExtractReturnPortionRecipes) =>
  content.match(/You got (\d+.\d+)% of the /)?.[1];
