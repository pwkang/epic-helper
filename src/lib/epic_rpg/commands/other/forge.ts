import {Message, User} from 'discord.js';
import {RPG_EQUIPMENT} from '../../../../constants/rpg_equipment';
import {updateUserRubyAmount} from '../../../../models/user/user.service';

const rubyConsumed = {
  [RPG_EQUIPMENT.ultraEdgyArmor]: 400,
};

interface IRpgForge {
  content: Message['content'];
  author: User;
}

const rpgForge = async ({content, author}: IRpgForge) => {
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

export default rpgForge;

interface IIsSuccessfullyForged {
  content: Message['content'];
}

export const isSuccessfullyForged = ({content}: IIsSuccessfullyForged) =>
  content.includes('successfully forged!');
