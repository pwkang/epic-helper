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

export const _setDonorP = ({author}: ISetDonor) => {
  function render(): BaseMessageOptions {
    return {
      components: [row],
      embeds: [embed]
    };
  }

  async function responseInteraction(
    customId: string
  ): Promise<BaseMessageOptions | null> {
    let tier: ValuesOf<typeof RPG_DONOR_TIER> | 'remove' | null = null;
    if (customId === 'remove') {
      await userService.removeRpgDonorPTier(author.id);
      tier = 'remove';
    } else {
      if (customId === 'non-donor') {
        tier = RPG_DONOR_TIER.nonDonor;
      } else if (customId === '0.9') {
        tier = RPG_DONOR_TIER.donor10;
      } else if (customId === '0.8') {
        tier = RPG_DONOR_TIER.donor20;
      } else if (customId === '0.65') {
        tier = RPG_DONOR_TIER.donor35;
      }
      await userService.updateRpgDonorPTier({
        userId: author.id,
        tier: tier!
      });
    }

    return {
      components: [],
      embeds: [getSuccessEmbed(tier!)]
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
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId('remove')
    .setLabel('Remove')
    .setStyle(ButtonStyle.Secondary)
);

const tierLabel = {
  [RPG_DONOR_TIER.nonDonor]: 'Non-donor',
  [RPG_DONOR_TIER.donor10]: '-10%',
  [RPG_DONOR_TIER.donor20]: '-20%',
  [RPG_DONOR_TIER.donor35]: '-35%',
  remove: ''
} as const;

const getSuccessEmbed = (tier: ValuesOf<typeof RPG_DONOR_TIER> | 'remove') => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);

  switch (tier) {
    case RPG_DONOR_TIER.nonDonor:
    case RPG_DONOR_TIER.donor10:
    case RPG_DONOR_TIER.donor20:
    case RPG_DONOR_TIER.donor35:
      embed
        .setTitle(
          `You have set your partner donor tier to ${tierLabel[tier]}\n`
        )
        .setDescription(
          'You will now hunt with your partner\'s cooldown reduction\n\n' +
            `If you wish to hunt with your own cooldown
You may use ${BOT_CLICKABLE_SLASH_COMMANDS.accountDonorPartner} and select "Remove"`
        );
      break;
    case 'remove':
      embed
        .setTitle('You have removed your partner EPIC RPG donor tier')
        .setDescription('You will now hunt with your cooldown');
      break;
  }

  return embed;
};

const embed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setTitle('Select your partner EPIC RPG donor tier')
  .setDescription(
    'By setting your partner donor tier,\nyou will hunt will your partner\'s cooldown'
  );
