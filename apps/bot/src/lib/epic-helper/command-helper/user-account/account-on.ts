import {BaseMessageOptions, EmbedBuilder, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {BOT_COLOR} from '@epic-helper/constants';

interface ITurnOnAccount {
  author: User;
}

export const _turnOnAccount = async ({author}: ITurnOnAccount): Promise<BaseMessageOptions> => {
  await userService.userAccountOn(author.id);
  return {
    embeds: [embed],
  };
};

const embed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('Successfully turned on the helper!');
