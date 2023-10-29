import type {User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR, PATREON_LINK} from '@epic-helper/constants';
import messageFormatter from '../../discordjs/message-formatter';

interface IDonorOnly {
  author: User;
}

const _donorOnly = ({author}: IDonorOnly) => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: author.username,
      iconURL: author.displayAvatarURL(),
    })
    .setDescription(
      [
        '**This command is only available for donor**',
        `You can support the bot by donating in ${messageFormatter.hyperlink(
          'Patreon',
          PATREON_LINK,
        )}`,
      ].join('\n'),
    );
};

export default _donorOnly;
