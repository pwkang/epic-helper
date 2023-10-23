import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@epic-helper/constants';

export const _notInGuild = async () => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(
      [
        'You are not registered in a guild!',
        'If you think this is a mistake, please send `rpg guild` in your guild server to register',
      ].join('\n'),
    );
};
