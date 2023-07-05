import {ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction} from 'discord.js';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  RPG_ENCHANT_LEVEL,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';

type SelectOptionsValue = ValuesOf<typeof RPG_ENCHANT_LEVEL> | 'remove';

export default <PrefixCommand>{
  name: 'setEnchant',
  commands: ['set enchant', 'setEnchant', 'se'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message) => {
    const event = await djsMessageHelper.interactiveSend({
      options: {
        content: 'Select an enchant level',
        components: [enchantLevel],
      },
      client,
      channelId: message.channel.id,
    });
    if (!event) return;
    event.on('enchantLevel', async (interaction) => {
      if (interaction instanceof StringSelectMenuInteraction) {
        event.stop();
        const selectedEnchantLevel = interaction.values[0] as SelectOptionsValue;
        switch (selectedEnchantLevel) {
          case 'remove':
            await userService.removeUserEnchantTier({userId: message.author.id});
            return {
              content: `You have removed your enchant tier`,
              components: [],
            };
          default:
            await userService.setUserEnchantTier({
              userId: message.author.id,
              tier: selectedEnchantLevel,
            });
            return {
              content: `You have selected ${interaction.values[0]}`,
              components: [],
            };
        }
      }
      return {
        components: [],
      };
    });
  },
};

const selectMenu = new StringSelectMenuBuilder()
  .setCustomId('enchantLevel')
  .setPlaceholder('Select an enchant level')
  .setOptions([
    {
      label: 'Normie',
      value: RPG_ENCHANT_LEVEL.normie,
    },
    {
      label: 'Good',
      value: RPG_ENCHANT_LEVEL.good,
    },
    {
      label: 'Great',
      value: RPG_ENCHANT_LEVEL.great,
    },
    {
      label: 'Mega',
      value: RPG_ENCHANT_LEVEL.mega,
    },
    {
      label: 'Epic',
      value: RPG_ENCHANT_LEVEL.epic,
    },
    {
      label: 'Hyper',
      value: RPG_ENCHANT_LEVEL.hyper,
    },
    {
      label: 'Ultimate',
      value: RPG_ENCHANT_LEVEL.ultimate,
    },
    {
      label: 'Perfect',
      value: RPG_ENCHANT_LEVEL.perfect,
    },
    {
      label: 'Edgy',
      value: RPG_ENCHANT_LEVEL.edgy,
    },
    {
      label: 'Ultra Edgy',
      value: RPG_ENCHANT_LEVEL['ultra-edgy'],
    },
    {
      label: 'Omega',
      value: RPG_ENCHANT_LEVEL.omega,
    },
    {
      label: 'Ultra Omega',
      value: RPG_ENCHANT_LEVEL['ultra-omega'],
    },
    {
      label: 'Godly',
      value: RPG_ENCHANT_LEVEL.godly,
    },
    {
      label: 'Void',
      value: RPG_ENCHANT_LEVEL.void,
    },
    {
      label: 'Remove',
      value: 'remove',
    },
  ]);

const enchantLevel = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
