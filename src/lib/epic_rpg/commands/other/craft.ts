import {Message, User} from 'discord.js';
import {RPG_EQUIPMENT} from '../../../../constants/rpg_equipment';
import {updateUserRubyAmount} from '../../../../models/user/user.service';

const rubyConsumed = {
  [RPG_EQUIPMENT.rubySword]: 4,
  [RPG_EQUIPMENT.rubyArmor]: 7,
  [RPG_EQUIPMENT.coinSword]: 4,
};

interface IRpgCraft {
  content: Message['content'];
  author: User;
}

const rpgCraft = async ({content, author}: IRpgCraft) => {
  const item = Object.entries(RPG_EQUIPMENT).find(([_, item]) =>
    content.toLowerCase().includes(item)
  )?.[1] as keyof typeof RPG_EQUIPMENT;
  if (!item) return;

  if (Object.keys(rubyConsumed).includes(item)) {
    const _item = item as keyof typeof rubyConsumed;
    await updateUserRubyAmount({
      type: 'dec',
      userId: author.id,
      ruby: rubyConsumed[_item],
    });
  }
};

export default rpgCraft;

interface IIsSuccessfullyCrafted {
  content: Message['content'];
}

export const isSuccessfullyCrafted = ({content}: IIsSuccessfullyCrafted) =>
  content.includes('successfully crafted!');
