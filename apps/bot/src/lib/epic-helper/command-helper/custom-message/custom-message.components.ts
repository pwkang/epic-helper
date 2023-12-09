import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';
import {CUSTOM_MESSAGE_PAGE_TYPE, CUSTOM_MESSAGE_PAGES} from './custom-message.constant';
import type {ValuesOf} from '@epic-helper/types';

export interface ICustomMessagePageSelector {
  pageType?: ValuesOf<typeof CUSTOM_MESSAGE_PAGE_TYPE>;
}

export const _customMessagePageSelector = ({
  pageType = CUSTOM_MESSAGE_PAGE_TYPE.general,
}: ICustomMessagePageSelector) =>
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    ...CUSTOM_MESSAGE_PAGES.map((page) =>
      new ButtonBuilder()
        .setCustomId(page.id)
        .setLabel(page.label)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page.id === pageType),
    ),
    new ButtonBuilder()
      .setCustomId('guide')
      .setLabel('Guide')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageType === CUSTOM_MESSAGE_PAGE_TYPE.guide),
  );
