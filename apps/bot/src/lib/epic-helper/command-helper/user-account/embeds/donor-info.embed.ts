import {EmbedBuilder, User} from 'discord.js';
import {IDonor, IFreeDonor} from '@epic-helper/models';
import {serverService} from '../../../../../services/database/server.service';
import {BOT_COLOR, DONOR_TOKEN_AMOUNT} from '@epic-helper/constants';
import {capitalizeFirstLetters} from '@epic-helper/utils';

interface IGetDonorInfoEmbed {
  donor: IDonor | null;
  author: User;
  freeDonor: IFreeDonor | null;
  boostedServers: Awaited<ReturnType<typeof serverService.getUserBoostedServers>>;
}

export const _getDonorInfoEmbed = ({
  freeDonor,
  donor,
  boostedServers,
  author,
}: IGetDonorInfoEmbed) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${author.username}'s donor info`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setThumbnail(author.avatarURL())
    .setColor(BOT_COLOR.embed);
  const donorToken = donor?.tier ? DONOR_TOKEN_AMOUNT[donor.tier] : 0;
  const freeToken = freeDonor?.token ?? 0;
  const totalToken = donorToken + freeToken;
  const usedToken = boostedServers.reduce((acc, server) => acc + server.token, 0);
  const remainingToken = totalToken - usedToken;

  if (donor?.tier) {
    embed.addFields({
      name: 'Donor',
      value: [
        `⚙️ - **Tier:** ${capitalizeFirstLetters(donor.tier)}`,
        `🚀 - **EPIC Tokens:** ${DONOR_TOKEN_AMOUNT[donor.tier]}`,
      ].join('\n'),
      inline: true,
    });
  }

  if (freeDonor?.token) {
    embed.addFields({
      name: 'Free donor',
      value: [`🚀 - **EPIC Tokens:** ${freeDonor.token}`].join('\n'),
      inline: true,
    });
  }

  if (boostedServers.length) {
    embed.addFields({
      name: `Boosted servers`,
      value: boostedServers
        .map((server, index) => `\`[${index + 1}]\` **${server.name}** - ${server.token} boosts`)
        .join('\n'),
      inline: false,
    });
  }

  if (totalToken) {
    embed.setFooter({
      text: `Token left: ${remainingToken} / ${totalToken}`,
    });
  }

  if (!donor?.tier && !freeDonor?.token && !boostedServers.length) {
    embed.setDescription('You are not a donor yet!');
  }

  return embed;
};