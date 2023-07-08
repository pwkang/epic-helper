import {
  ActionRowBuilder,
  BaseMessageOptions,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  User,
} from 'discord.js';
import {RPG_ENCHANT_LEVEL} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';

interface ISlashAccountEnchant {
  author: User;
}

export const _setEnchant = ({author}: ISlashAccountEnchant) => {
  function render(): BaseMessageOptions {
    return {
      content: 'Select target enchant tier',
      components: [actionRow],
    };
  }

  async function responseInteraction(
    interaction: StringSelectMenuInteraction
  ): Promise<BaseMessageOptions> {
    const selectedEnchantLevel = interaction.values[0] as
      | ValuesOf<typeof RPG_ENCHANT_LEVEL>
      | 'remove';
    switch (selectedEnchantLevel) {
      case 'remove':
        await userService.removeUserEnchantTier({userId: author.id});
        return {
          content: `You have removed your enchant tier`,
          components: [],
        };
      default:
        await userService.setUserEnchantTier({
          userId: author.id,
          tier: selectedEnchantLevel,
        });
        return {
          content: `You have selected ${interaction.values[0]}`,
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
    ])
);
