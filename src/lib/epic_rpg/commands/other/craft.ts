import {Client, Message, User} from 'discord.js';
import {RPG_EQUIPMENT} from '../../../../constants/rpg_equipment';
import {updateUserRubyAmount} from '../../../../models/user/user.service';
import {createRpgCommandListener} from '../../createRpgCommandListener';

const rubyConsumed = {
  [RPG_EQUIPMENT.rubySword]: 4,
  [RPG_EQUIPMENT.rubyArmor]: 7,
  [RPG_EQUIPMENT.coinSword]: 4,
};

interface IRpgCraft {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgCraft({client, message, author, isSlashCommand}: IRpgCraft) {
  const event = createRpgCommandListener({
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
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgCraftSuccess {
  content: Message['content'];
  author: User;
}

const rpgCraftSuccess = async ({content, author}: IRpgCraftSuccess) => {
  const item = Object.entries(RPG_EQUIPMENT).find(([_, item]) =>
    content.toLowerCase().includes(item)
  )?.[1] as keyof typeof RPG_EQUIPMENT;
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
    await updateUserRubyAmount({
      type: 'dec',
      userId: author.id,
      ruby,
    });
  }
};

export default rpgCraftSuccess;

interface IIsSuccessfullyCrafted {
  content: Message['content'];
}

export const isSuccessfullyCrafted = ({content}: IIsSuccessfullyCrafted) =>
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
