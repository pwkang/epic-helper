import {guildService} from '../../../../services/database/guild.service';
import type {
  BaseInteraction,
  BaseMessageOptions,
  Guild,
  InteractionReplyOptions,
  StringSelectMenuInteraction,
} from 'discord.js';
import {_getGuildSettingsEmbed} from './embed/guild-settings.embed';
import messageFormatter from '../../../discordjs/message-formatter';
import {getGuildToggleEmbed} from '../toggle/type/guild.toggle';
import {guildSelectorHelper} from '../../../../utils/guild-selector';

export const GUILD_SETTINGS_PAGE_TYPE = {
  settings: 'settings',
  toggle: 'toggle',
} as const;

interface IShowSettings {
  server: Guild;
  initialGuildRoleId?: string;
  type: ValuesOf<typeof GUILD_SETTINGS_PAGE_TYPE>;
}

export const _showSettings = async ({
  server,
  type,
  initialGuildRoleId,
}: IShowSettings) => {
  const guilds = await guildService.getAllGuilds({
    serverId: server.id,
  });
  const guildSelector = guildSelectorHelper({
    currentGuildRoleId: initialGuildRoleId ?? guilds[0]?.roleId,
    guilds,
    server,
  });

  function getMessagePayload(): InteractionReplyOptions {
    if (!guilds.length)
      return {
        content: 'There is no guild setup in this server',
      };
    if (!guilds.find((guild) => guild.roleId === guildSelector.getGuildId())) {
      return {
        content: `There is no guild with role ${messageFormatter.role(
          guildSelector.getGuildId(),
        )} setup in this server`,
        ephemeral: true,
      };
    }

    return {
      embeds: [getEmbed()],
      components: guildSelector.getSelector(),
    };
  }

  function getEmbed() {
    switch (type) {
      case GUILD_SETTINGS_PAGE_TYPE.settings:
        return _getGuildSettingsEmbed({
          guildAccount: guilds.find(
            (guild) => guild.roleId === guildSelector.getGuildId(),
          )!,
        });
      case GUILD_SETTINGS_PAGE_TYPE.toggle:
        return getGuildToggleEmbed({
          guildAccount: guilds.find(
            (guild) => guild.roleId === guildSelector.getGuildId(),
          )!,
        });
    }
  }

  function replyInteraction({
    interaction,
  }: IReplyInteraction): BaseMessageOptions {
    guildSelector.readInteraction({
      interaction,
    });
    return {
      embeds: [getEmbed()],
      components: guildSelector.getSelector(),
    };
  }

  return {
    getMessagePayload,
    replyInteraction,
  };
};

interface IReplyInteraction {
  interaction: BaseInteraction | StringSelectMenuInteraction;
  customId: string;
}
