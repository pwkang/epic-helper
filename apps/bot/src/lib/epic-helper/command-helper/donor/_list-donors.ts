import {BOT_COLOR, DONOR_TIER, DONOR_TOKEN_AMOUNT} from '@epic-helper/constants';
import donorService from '../../../../services/database/donor.service';
import {
  ActionRowBuilder,
  BaseInteraction,
  BaseMessageOptions,
  Client,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  UserSelectMenuBuilder,
} from 'discord.js';
import {IDonor} from '@epic-helper/models';
import messageFormatter from '../../../discordjs/message-formatter';
import {djsUserHelper} from '../../../discordjs/user';
import timestampHelper from '../../../discordjs/timestamp';
import {generateNavigationRow, NAVIGATION_ROW_BUTTONS} from '../../../../utils/pagination-row';
import {capitalizeFirstLetters, typedObjectEntries} from '@epic-helper/utils';

const PAGE_SIZE = 6;

interface IListDonors {
  client: Client;
}

export const _listDonors = ({client}: IListDonors) => {
  let page = 0;
  let tier: ValuesOf<typeof DONOR_TIER> | undefined = undefined;
  let total = 0;
  let userId: string | undefined = undefined;

  const generateComponents = (): BaseMessageOptions['components'] => {
    const components = [];

    components.push(generateTierSelector(tier));

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
      const donor = await donorService.findDonor({
        discordUserId: userId,
      });
      total = 0;
      embed = await buildDonorEmbed({
        client,
        donor: donor ?? undefined,
        userId,
      });
    } else {
      const donors = await donorService.getDonors({
        tier,
        page,
        limit: PAGE_SIZE,
      });
      total = donors.total;
      embed = await buildDonorsEmbed({
        donors: donors.data,
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
    if (interaction.isStringSelectMenu()) {
      tier =
        interaction.values[0] === 'all'
          ? undefined
          : (interaction.values[0] as ValuesOf<typeof DONOR_TIER>);
      page = 0;
      userId = undefined;
    }
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
  donors: IDonor[];
  total: number;
  page: number;
  client: Client;
}

const buildDonorsEmbed = async ({donors, page, total, client}: IBuildEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setFooter({
    text: `Page ${page + 1}/${Math.ceil(total / PAGE_SIZE)} • total: ${total}`,
  });

  for (let donor of donors) {
    const user = await fetchUser(client, donor.discord.userId);
    embed.addFields({
      name: donor.discord.userId ?? '-',
      value: [
        user ? messageFormatter.user(user.id) : 'Unknown',
        user ? `**${user.tag}**` : null,
        `**Tier:** ${donor.tier ?? '-'}`,
        `**Expires:** ${timestampHelper.relative({time: donor.expiresAt})}`,
        `**Token:** ${donor.boostedGuilds.length}/${
          donor.tier ? DONOR_TOKEN_AMOUNT[donor.tier] : '0'
        }`,
      ]
        .filter((value) => !!value)
        .join('\n'),
      inline: true,
    });
  }

  return embed;
};

const generateTierSelector = (tier?: ValuesOf<typeof DONOR_TIER>) => {
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('tier')
      .setPlaceholder('Tier')
      .addOptions(
        {
          label: 'No filter',
          value: 'all',
          default: !tier,
          description: 'Show all donors',
        },
        ...typedObjectEntries(DONOR_TIER).map(([key, value]) => ({
          value,
          label: capitalizeFirstLetters(key),
          default: value === tier,
          description: `Token: ${DONOR_TOKEN_AMOUNT[value]}`,
        }))
      )
  );
};

const userSelector = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
  new UserSelectMenuBuilder().setCustomId('user').setPlaceholder('User')
);

interface IBuildDonorEmbed {
  donor?: IDonor;
  client: Client;
  userId: string;
}

const buildDonorEmbed = async ({donor, userId, client}: IBuildDonorEmbed) => {
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
  embed.addFields(
    {
      name: 'PROFILE',
      value: [
        `**Status:** ${
          donor ? (donor.expiresAt.getTime() > Date.now() ? 'Active' : 'Expired') : 'Non-donor'
        }`,
        `**Tier:** ${donor?.tier ? capitalizeFirstLetters(donor.tier) : '-'}`,
        `**Expires:** ${donor ? timestampHelper.relative({time: donor.expiresAt}) : '-'}`,
        `**Token:** ${donor?.boostedGuilds.length ?? '0'}/${
          donor?.tier ? DONOR_TOKEN_AMOUNT[donor.tier] : '0'
        }`,
      ].join('\n'),
      inline: false,
    },
    {
      name: 'BOOSTED GUILDS',
      value:
        // TODO: fetch guild name here
        donor?.boostedGuilds.length
          ? donor?.boostedGuilds.map((guild) => `${guild.guildId} - ${guild.token}`).join('\n')
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
