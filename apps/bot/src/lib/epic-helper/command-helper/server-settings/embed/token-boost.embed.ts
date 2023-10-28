import type {IServerSettings} from '../type';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR, BOT_EMOJI} from '@epic-helper/constants';
import type {serverChecker} from '../../../server-checker';
import messageFormatter from '../../../../discordjs/message-formatter';

interface IGetTokenBoostsEmbed extends IServerSettings {
  tokenStatus: Awaited<ReturnType<typeof serverChecker.getTokenStatus>>;
}

const usersPerField = 10;

export const _getTokenBoostsEmbed = ({
  guild,
  tokenStatus,
}: IGetTokenBoostsEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${guild.name}'s token boosts`,
    iconURL: guild.iconURL() ?? undefined,
  });
  const validIcons = tokenStatus.isValid
    ? BOT_EMOJI.utils.on
    : BOT_EMOJI.utils.off;
  embed.setDescription(
    [
      'Donors can boost the server with their EPIC Tokens.',
      'EPIC tokens allows server members to access all donor perks in the server.',
      'Every 100 members will require 1 token',
      'You can set donor roles to restrict the boost to only users with the role.',
      '',
      `**Members:** ${tokenStatus.activeUsersCount}`,
      `**Tokens:** ${tokenStatus.totalValidTokens}`,
      `**Status:** ${validIcons}`,
    ].join('\n'),
  );

  embed.addFields({
    name: 'Donor roles',
    value:
      tokenStatus.donorRoles
        .map((role) => messageFormatter.role(role))
        .join(', ') || '-',
  });

  const totalUsers = tokenStatus.validBoosters.length;
  if (totalUsers) {
    for (let i = 0; i < totalUsers; i += usersPerField) {
      const users = tokenStatus.validBoosters.slice(i, i + usersPerField);
      embed.addFields({
        name: 'Boosters',
        value: users
          .map(
            (user) => `${messageFormatter.user(user.userId)} - ${user.tokens}`,
          )
          .join('\n'),
        inline: true,
      });
    }
  } else {
    embed.addFields({
      name: 'Boosters',
      value: '-',
      inline: true,
    });
  }

  if (tokenStatus.invalidBoosters.length) {
    const totalUsers = tokenStatus.invalidBoosters.length;
    for (let i = 0; i < totalUsers; i += usersPerField) {
      const users = tokenStatus.invalidBoosters.slice(i, i + usersPerField);
      embed.addFields({
        name: 'Expired boosters',
        value: users
          .map(
            (user) => `${messageFormatter.user(user.userId)} - ${user.tokens}`,
          )
          .join('\n'),
        inline: true,
      });
    }
  }

  return embed;
};
