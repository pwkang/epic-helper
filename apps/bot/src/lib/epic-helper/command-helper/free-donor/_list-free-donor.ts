import {BOT_COLOR} from '@epic-helper/constants';
import {
  ActionRowBuilder,
  BaseInteraction,
  BaseMessageOptions,
  Client,
  EmbedBuilder,
  StringSelectMenuInteraction,
  UserSelectMenuBuilder,
} from 'discord.js';
import {IFreeDonor} from '@epic-helper/models';
import messageFormatter from '../../../discordjs/message-formatter';
import {djsUserHelper} from '../../../discordjs/user';
import timestampHelper from '../../../discordjs/timestamp';
import {generateNavigationRow, NAVIGATION_ROW_BUTTONS} from '../../../../utils/pagination-row';
import freeDonorService from '../../../../services/database/free-donor.service';
import {serverService} from '../../../../services/database/server.service';

const PAGE_SIZE = 6;

interface IListFreeDonors {
  client: Client;
}

export const _listFreeDonors = ({client}: IListFreeDonors) => {
  let page = 0;
  let total = 0;
  let userId: string | undefined = undefined;

  const generateComponents = (): BaseMessageOptions['components'] => {
    const components = [];

    components.push(userSelector);
    if (!userId) {
      components.push(
        generateNavigationRow({
          page,
          total,
          all: false,
          itemsPerPage: PAGE_SIZE,
        })
      );
    }

    return components;
  };

  const render = async (): Promise<BaseMessageOptions> => {
    let embed: EmbedBuilder;
    if (userId) {
      const donor = await freeDonorService.findFreeDonor({
        discordUserId: userId,
      });
      total = 0;
      embed = await buildFreeDonorEmbed({
        client,
        freeDonor: donor ?? undefined,
        userId,
      });
    } else {
      const donors = await freeDonorService.getFreeDonors({
        page,
        limit: PAGE_SIZE,
      });
      total = donors.total;
      embed = await buildFreeDonorsEmbed({
        freeDonors: donors.data,
        total: donors.total,
        client,
        page,
      });
    }
    return {
      embeds: [embed],
      components: generateComponents(),
    };
  };

  const responseInteraction = async (
    interaction: BaseInteraction | StringSelectMenuInteraction
  ): Promise<BaseMessageOptions | null> => {
    if (interaction.isButton()) {
      const customId = interaction.customId as ValuesOf<typeof NAVIGATION_ROW_BUTTONS>;
      switch (customId) {
        case NAVIGATION_ROW_BUTTONS.first:
          page = 0;
          break;
        case NAVIGATION_ROW_BUTTONS.prev:
          page--;
          break;
        case NAVIGATION_ROW_BUTTONS.next:
          page++;
          break;
        case NAVIGATION_ROW_BUTTONS.last:
          page = Math.ceil(total / PAGE_SIZE) - 1;
          break;
      }
    }
    if (interaction.isUserSelectMenu()) {
      userId = interaction.values[0];
    }
    return await render();
  };

  return {
    render,
    responseInteraction,
  };
};

interface IBuildEmbed {
  freeDonors: IFreeDonor[];
  total: number;
  page: number;
  client: Client;
}

const buildFreeDonorsEmbed = async ({freeDonors, page, total, client}: IBuildEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setFooter({
    text: `Page ${page + 1}/${Math.ceil(total / PAGE_SIZE)} • total: ${total}`,
  });

  for (const donor of freeDonors) {
    const user = await fetchUser(client, donor.discordId);
    embed.addFields({
      name: donor.discordId ?? '-',
      value: [
        user ? messageFormatter.user(user.id) : 'Unknown',
        user ? `**${user.tag}**` : null,
        `**Expires:** ${timestampHelper.relative({time: donor.expiresAt})}`,
        `**Token:** ${donor.token ?? '0'}`,
      ]
        .filter((value) => !!value)
        .join('\n'),
      inline: true,
    });
  }
  if (!freeDonors.length) {
    embed.setDescription('No free donors found');
  }

  return embed;
};

const userSelector = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
  new UserSelectMenuBuilder().setCustomId('user').setPlaceholder('User')
);

interface IBuildDonorEmbed {
  freeDonor?: IFreeDonor;
  client: Client;
  userId: string;
}

const buildFreeDonorEmbed = async ({freeDonor, userId, client}: IBuildDonorEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);
  const user = await fetchUser(client, userId);
  if (user) {
    embed.setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL(),
    });
    embed.setThumbnail(user.displayAvatarURL());
    embed.setDescription(messageFormatter.user(user.id));
  }
  const boostedGuilds = await serverService.getUserBoostedServers({
    userId,
  });
  embed.addFields(
    {
      name: 'PROFILE',
      value: [
        `**Status:** ${
          freeDonor
            ? freeDonor.expiresAt.getTime() > Date.now()
              ? 'Active'
              : 'Expired'
            : 'Non-donor'
        }`,
        `**Expires:** ${freeDonor ? timestampHelper.relative({time: freeDonor.expiresAt}) : '-'}`,
        `**Token:** ${freeDonor?.token ?? '0'}`,
      ].join('\n'),
      inline: false,
    },
    {
      name: 'BOOSTED GUILDS',
      value: boostedGuilds.length
        ? boostedGuilds
          .map((guild, index) => `\`[${index + 1}]\` **${guild.name}**- ${guild.token}`)
          .join('\n')
        : '-',
      inline: false,
    }
  );

  embed.setFooter({
    text: userId,
  });
  return embed;
};

const fetchUser = async (client: Client, userId?: string) =>
  userId
    ? await djsUserHelper.getUser({
      userId,
      client,
    })
    : null;
