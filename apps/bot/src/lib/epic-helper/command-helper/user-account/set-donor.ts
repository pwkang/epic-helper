import type {BaseMessageOptions, User} from 'discord.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from 'discord.js';
import {
  BOT_CLICKABLE_SLASH_COMMANDS,
  BOT_COLOR,
  RPG_DONOR_TIER
} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';

interface ISetDonor {
  author: User;
}

export const _setDonor = ({author}: ISetDonor) => {
  function render(): BaseMessageOptions {
    return {
      embeds: [embed],
      components: [row]
    };
  }

  async function responseInteraction(
    customId: string
  ): Promise<BaseMessageOptions | null> {
    let tier: ValuesOf<typeof RPG_DONOR_TIER> | null = null;
    if (customId === 'non-donor') {
      tier = RPG_DONOR_TIER.nonDonor;
    } else if (customId === '0.9') {
      tier = RPG_DONOR_TIER.donor10;
    } else if (customId === '0.8') {
      tier = RPG_DONOR_TIER.donor20;
    } else if (customId === '0.65') {
      tier = RPG_DONOR_TIER.donor35;
    }
    if (!tier) return null;
    await userService.updateRpgDonorTier({
      userId: author.id,
      tier
    });

    return {
      components: [],
      embeds: [getSuccessEmbed(tier)]
    };
  }

  return {
    render,
    responseInteraction
  };
};

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId('non-donor')
    .setLabel('Non-donor')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId('0.9')
    .setLabel('-10%')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId('0.8')
    .setLabel('-20%')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId('0.65')
    .setLabel('-35%')
    .setStyle(ButtonStyle.Primary)
);

const RESPONSE_MSG = {
  [RPG_DONOR_TIER.nonDonor]: 'You have set your donor tier to Non-donor',
  [RPG_DONOR_TIER.donor10]: 'You have set your donor tier to -10%',
  [RPG_DONOR_TIER.donor20]: 'You have set your donor tier to -20%',
  [RPG_DONOR_TIER.donor35]: 'You have set your donor tier to -35%'
} as const;

const getSuccessEmbed = (tier: ValuesOf<typeof RPG_DONOR_TIER>) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);

  embed.setTitle(RESPONSE_MSG[tier]);

  embed.setDescription(
    `If you wish to hunt with your partner's cooldown, you can setup via ${BOT_CLICKABLE_SLASH_COMMANDS.accountDonorPartner}`
  );

  return embed;
};

const embed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('Select your EPIC RPG cd reduction');
