import type {
  BaseMessageOptions,
  Client,
  Guild,
  StringSelectMenuInteraction,
} from 'discord.js';
import {ActionRowBuilder, StringSelectMenuBuilder} from 'discord.js';
import {serverService} from '../../../../services/database/server.service';
import {_getRandomEventSettingsEmbed} from './embed/random-event.embed';
import _getEnchantChannelsEmbed from './embed/enchant-channels.embed';
import {SERVER_SETTINGS_PAGE_TYPE} from './constant';
import {_getTTVerificationSettingsEmbed} from './embed/tt-verification.embed';
import {_getServerAdminEmbed} from './embed/server-admin-embed';
import {_getServerAdminRoleEmbed} from './embed/server-admin-role-embed';
import {_getTokenBoostsEmbed} from './embed/token-boost.embed';
import {serverChecker} from '../../server-checker';

interface IServerSettings {
  server: Guild;
  client: Client;
}

interface IRender {
  type: ValuesOf<typeof SERVER_SETTINGS_PAGE_TYPE>;
  displayOnly?: boolean;
}

export const _serverSettings = async ({server, client}: IServerSettings) => {
  const serverAccount = await serverService.getServer({
    serverId: server.id,
  });
  if (!serverAccount) return null;
  const tokenStatus = await serverChecker.getTokenStatus({
    serverId: server.id,
    client,
  });

  const render = ({type, displayOnly}: IRender): BaseMessageOptions => {
    let embed;
    switch (type) {
      case SERVER_SETTINGS_PAGE_TYPE.randomEvent:
        embed = _getRandomEventSettingsEmbed({
          serverAccount,
          guild: server,
        });
        break;
      case SERVER_SETTINGS_PAGE_TYPE.enchantMute:
        embed = _getEnchantChannelsEmbed({
          enchantSettings: serverAccount.settings.enchant,
          guild: server,
        });
        break;
      case SERVER_SETTINGS_PAGE_TYPE.ttVerification:
        embed = _getTTVerificationSettingsEmbed({
          serverAccount,
          guild: server,
        });
        break;
      case SERVER_SETTINGS_PAGE_TYPE.admins:
        embed = _getServerAdminEmbed({
          serverAccount,
          guild: server,
        });
        break;
      case SERVER_SETTINGS_PAGE_TYPE.adminRoles:
        embed = _getServerAdminRoleEmbed({
          serverAccount,
          guild: server,
        });
        break;
      case SERVER_SETTINGS_PAGE_TYPE.tokenBoosts:
        embed = _getTokenBoostsEmbed({
          serverAccount,
          guild: server,
          tokenStatus,
        });
        break;
    }
    let components: ActionRowBuilder<StringSelectMenuBuilder>[] = [];

    if (!displayOnly) {
      components = [_getServerSettingsPageSelector({pageType: type})];
    }

    return {
      embeds: [embed],
      components,
    };
  };

  const responseInteraction = (
    interaction: StringSelectMenuInteraction,
  ): BaseMessageOptions => {
    const pageType = interaction.values[0] as ValuesOf<
      typeof SERVER_SETTINGS_PAGE_TYPE
    >;
    return render({type: pageType});
  };

  return {
    render,
    responseInteraction,
  };
};

interface IGetServerSettingsPageSelector {
  pageType?: ValuesOf<typeof SERVER_SETTINGS_PAGE_TYPE>;
}

interface IPage {
  id: ValuesOf<typeof SERVER_SETTINGS_PAGE_TYPE>;
  label: string;
}

const SERVER_SETTINGS_PAGES: IPage[] = [
  {
    id: SERVER_SETTINGS_PAGE_TYPE.randomEvent,
    label: 'Random event',
  },
  {
    id: SERVER_SETTINGS_PAGE_TYPE.enchantMute,
    label: 'Enchant mute',
  },
  {
    id: SERVER_SETTINGS_PAGE_TYPE.ttVerification,
    label: 'TT verification',
  },
  {
    id: SERVER_SETTINGS_PAGE_TYPE.admins,
    label: 'Admins',
  },
  {
    id: SERVER_SETTINGS_PAGE_TYPE.adminRoles,
    label: 'Admin roles',
  },
  {
    id: SERVER_SETTINGS_PAGE_TYPE.tokenBoosts,
    label: 'EPIC Token booster',
  },
];

const _getServerSettingsPageSelector = ({
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
        })),
      ),
  );
