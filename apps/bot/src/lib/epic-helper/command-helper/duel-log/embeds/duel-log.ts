import type {User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../../discordjs/message-formatter';
import convertMsToHumanReadableString from '../../../../../utils/convert-ms-to-human-readable-string';

interface IGenerateEmbed {
  author: User;
  lastDuel?: Date;
  expGained: number;
  newTotalExp: number;
  newTotalDuel: number;
  source?: {
    serverId: string;
    channelId: string;
    messageId: string;
  };
  serverName: string;
  isExists?: boolean;
}

export const generateDuelLogEmbed = ({
  author,
  lastDuel,
  expGained,
  newTotalExp,
  newTotalDuel,
  source,
  serverName,
  isExists,
}: IGenerateEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: author.username,
    iconURL: author.displayAvatarURL(),
  });
  if (isExists) {
    embed.setTitle(`Updated ${expGained} XP`);
  } else {
    embed.setTitle(`Added ${expGained} XP`);
  }
  const description = [
    `**New:** \`${newTotalExp} XP | ${newTotalDuel} duels\``,
  ];
  if (source) {
    description.push(
      `[Jump to duel result](${messageFormatter.messageUrl({
        channelId: source.channelId,
        messageId: source.messageId,
        serverId: source.serverId,
      })}) **@ ${serverName}**`,
    );
  }
  embed.setDescription(description.join('\n'));

  const timeStr = lastDuel
    ? convertMsToHumanReadableString(
      new Date().getTime() - lastDuel.getTime(),
    ) + ' ago'
    : 'N/A';
  embed.setFooter({
    text: `Last duel: ${timeStr}`,
  });
  return embed;
};
