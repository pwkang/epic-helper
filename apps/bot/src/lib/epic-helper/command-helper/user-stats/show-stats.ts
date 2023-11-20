import type {BaseInteraction, Client, User} from 'discord.js';
import {getStatsEmbeds, statsActionRow} from '../../features/stats';
import {userChecker} from '../../user-checker';

interface IShowStats {
  client: Client;
  author: User;
  serverId: string;
}

export const _showStats = async ({client, author, serverId}: IShowStats) => {
  const stats = await getStatsEmbeds({
    author,
  });
  const isDonor = await userChecker.isDonor({
    userId: author.id,
    serverId,
    client,
  });

  const render = () => {
    if (isDonor)
      return {
        embeds: [stats.donor],
        components: [statsActionRow],
      };
    return {
      embeds: [stats.nonDonor],
    };
  };

  const replyInteraction = (interaction: BaseInteraction) => {
    if (!interaction.isButton()) return null;
    switch (interaction.customId) {
      case 'default':
        return {
          embeds: [stats.donor],
        };
      case 'thisWeek':
        return {
          embeds: [stats.thisWeek],
        };
      case 'lastWeek':
        return {
          embeds: [stats.lastWeek],
        };
      default:
        return null;
    }
  };

  return {
    render,
    replyInteraction,
    hasComponents: isDonor,
  };

};
