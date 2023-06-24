import {BaseMessageOptions, Guild} from 'discord.js';
import {IServer} from '@epic-helper/models';
import {SERVER_SETTINGS_PAGE_TYPE} from './constant';
import {_getServerSettingsPageSelector} from './page-selector';
import {_getServerSettingsEmbeds} from './embed';

export interface IGetMessagePayload {
  guild: Guild;
  serverAccount: IServer;
  pageType?: ValuesOf<typeof SERVER_SETTINGS_PAGE_TYPE>;
}

export const _getMessagePayload = ({
  guild,
  serverAccount,
  pageType = SERVER_SETTINGS_PAGE_TYPE.randomEvent,
}: IGetMessagePayload): BaseMessageOptions => {
  const embedList = _getServerSettingsEmbeds({
    serverAccount,
    guild,
  });
  const pageSelector = _getServerSettingsPageSelector({
    pageType,
  });
  return {
    embeds: [embedList[pageType]],
    components: [pageSelector],
  };
};
