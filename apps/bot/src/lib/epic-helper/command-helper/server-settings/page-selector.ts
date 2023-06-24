import {SERVER_SETTINGS_PAGE_TYPE, SERVER_SETTINGS_PAGES} from './constant';
import {ActionRowBuilder, StringSelectMenuBuilder} from 'discord.js';

export interface IGetServerSettingsPageSelector {
  pageType?: ValuesOf<typeof SERVER_SETTINGS_PAGE_TYPE>;
}

export const _getServerSettingsPageSelector = ({
  pageType = SERVER_SETTINGS_PAGE_TYPE.randomEvent,
}: IGetServerSettingsPageSelector) =>
  new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('page-type')
      .setPlaceholder('Select a page')
      .setOptions(
        SERVER_SETTINGS_PAGES.map(({id, label}) => ({
          label,
          value: id,
          default: id === pageType,
        }))
      )
  );
