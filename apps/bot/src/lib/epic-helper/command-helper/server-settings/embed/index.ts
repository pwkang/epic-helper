import {_getRandomEventSettingsEmbed} from './random-event.embed';
import {EmbedBuilder, Guild} from 'discord.js';
import {IServer} from '@epic-helper/models';
import {SERVER_SETTINGS_PAGE_TYPE} from '../constant';
import _getEnchantChannelsEmbed from './enchant-channels.embed';

export interface IServerSettings {
  guild: Guild;
  serverAccount: IServer;
}

export const _getServerSettingsEmbeds = ({
  guild,
  serverAccount,
}: IServerSettings): Record<keyof typeof SERVER_SETTINGS_PAGE_TYPE, EmbedBuilder> => {
  return {
    randomEvent: _getRandomEventSettingsEmbed({serverAccount, guild}),
    enchantMute: _getEnchantChannelsEmbed({
      enchantSettings: serverAccount.settings.enchant,
      guild,
    }),
  };
};
