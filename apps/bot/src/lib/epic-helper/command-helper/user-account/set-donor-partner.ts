import {ActionRowBuilder, BaseMessageOptions, ButtonBuilder, ButtonStyle, User} from 'discord.js';
import {RPG_DONOR_TIER} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';

interface ISetDonor {
  author: User;
}

export const _setDonorP = ({author}: ISetDonor) => {
  function render(): BaseMessageOptions {
    return {
      content: 'Select your partner epic rpg cd reduction',
      components: [row],
    };
  }

  async function responseInteraction(customId: string): Promise<BaseMessageOptions | null> {
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
        tier: tier!,
      });
    }

    return {
      content: RESPONSE_MSG[tier!],
      components: [],
    };
  }

  return {
    render,
    responseInteraction,
  };
};

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder().setCustomId('non-donor').setLabel('Non-donor').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('0.9').setLabel('-10%').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('0.8').setLabel('-20%').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('0.65').setLabel('-35%').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('remove').setLabel('Remove').setStyle(ButtonStyle.Secondary)
);

const RESPONSE_MSG = {
  [RPG_DONOR_TIER.nonDonor]: 'You have set your partner donor tier to Non-donor',
  [RPG_DONOR_TIER.donor10]: 'You have set your partner donor tier to -10%',
  [RPG_DONOR_TIER.donor20]: 'You have set your partner donor tier to -20%',
  [RPG_DONOR_TIER.donor35]: 'You have set your partner donor tier to -35%',
  remove: 'You have removed your partner donor tier settings',
} as const;
