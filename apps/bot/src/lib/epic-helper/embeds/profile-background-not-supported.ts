import {EmbedBuilder, User} from 'discord.js';
import {BOT_COLOR, RPG_CLICKABLE_SLASH_COMMANDS} from '@epic-helper/constants';

interface IProfileBackgroundNotSupported {
  author: User;
}

const _profileBackgroundNotSupported = ({author}: IProfileBackgroundNotSupported) => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(
      'Profile background is not supported yet.\n' +
        `Use ${RPG_CLICKABLE_SLASH_COMMANDS.progress} instead.`
    );
};

export default _profileBackgroundNotSupported;
