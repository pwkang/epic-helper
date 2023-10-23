import type {User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR, RPG_CLICKABLE_SLASH_COMMANDS} from '@epic-helper/constants';

interface IProfileBackgroundNotSupported {
  author: User;
}

const _profileBackgroundNotSupported = ({
  author,
}: IProfileBackgroundNotSupported) => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: author.username,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setDescription(
      'Profile background is not supported yet.\n' +
        `Use ${RPG_CLICKABLE_SLASH_COMMANDS.progress} instead.`,
    );
};

export default _profileBackgroundNotSupported;
