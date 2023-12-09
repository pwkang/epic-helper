import type {BaseMessageOptions, Guild, StringSelectMenuInteraction, User} from 'discord.js';
import {ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder} from 'discord.js';
import {BOT_COLOR, RPG_ENCHANT_LEVEL} from '@epic-helper/constants';
import {serverService, userService} from '@epic-helper/services';
import type {IServer} from '@epic-helper/models';
import messageFormatter from '../../../discordjs/message-formatter';
import type {ValuesOf} from '@epic-helper/types';

interface ISlashAccountEnchant {
  author: User;
  server: Guild;
}

export const _setEnchant = async ({author, server}: ISlashAccountEnchant) => {
  const serverAccount = await serverService.getServer({
    serverId: server.id,
  });

  function render(): BaseMessageOptions {
    return {
      components: [actionRow],
      embeds: [selectEnchantEmbed],
    };
  }

  async function responseInteraction(
    interaction: StringSelectMenuInteraction,
  ): Promise<BaseMessageOptions> {
    const selectedEnchantLevel = interaction.values[0] as
      | ValuesOf<typeof RPG_ENCHANT_LEVEL>
      | 'remove';
    switch (selectedEnchantLevel) {
      case 'remove':
        await userService.removeUserEnchantTier({userId: author.id});
        return {
          components: [],
          embeds: [removedEmbed],
        };
      default:
        await userService.setUserEnchantTier({
          userId: author.id,
          tier: selectedEnchantLevel,
        });
        return {
          embeds: [getEmbed({serverAccount, tier: selectedEnchantLevel})],
          components: [],
        };
    }
  }

  return {
    render,
    responseInteraction,
  };
};

const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId('enchantLevel')
    .setPlaceholder('Select an enchant level')
    .setOptions([
      {label: 'Normie', value: RPG_ENCHANT_LEVEL.normie},
      {label: 'Good', value: RPG_ENCHANT_LEVEL.good},
      {label: 'Great', value: RPG_ENCHANT_LEVEL.great},
      {label: 'Mega', value: RPG_ENCHANT_LEVEL.mega},
      {label: 'Epic', value: RPG_ENCHANT_LEVEL.epic},
      {label: 'Hyper', value: RPG_ENCHANT_LEVEL.hyper},
      {label: 'Ultimate', value: RPG_ENCHANT_LEVEL.ultimate},
      {label: 'Perfect', value: RPG_ENCHANT_LEVEL.perfect},
      {label: 'Edgy', value: RPG_ENCHANT_LEVEL.edgy},
      {label: 'Ultra Edgy', value: RPG_ENCHANT_LEVEL['ultra-edgy']},
      {label: 'Omega', value: RPG_ENCHANT_LEVEL.omega},
      {label: 'Ultra Omega', value: RPG_ENCHANT_LEVEL['ultra-omega']},
      {label: 'Godly', value: RPG_ENCHANT_LEVEL.godly},
      {label: 'Void', value: RPG_ENCHANT_LEVEL.void},
      {label: 'Remove', value: 'remove'},
    ]),
);

interface IGetEmbed {
  serverAccount: IServer | null;
  tier: ValuesOf<typeof RPG_ENCHANT_LEVEL>;
}

const getEmbed = ({serverAccount, tier}: IGetEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setDescription(
    `Successfully set your target enchant tier to **${tier.toUpperCase()}**
    
    Note: Enchant mute will only available in the channels set by server admins`,
  );

  if (serverAccount?.settings.enchant.channels.length) {
    embed.addFields({
      name: 'Available channels',
      value: serverAccount.settings.enchant.channels
        .map((channel) => messageFormatter.channel(channel.channelId))
        .join(' '),
    });
  } else {
    embed.addFields({
      name: 'Available channels',
      value: 'No channel set',
    });
  }

  return embed;
};

const removedEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('You have removed your enchant tier');

const selectEnchantEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('Select your target enchant tier');
