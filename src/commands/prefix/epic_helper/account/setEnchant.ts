import {COMMAND_TYPE} from '../../../../constants/bot';
import {ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction} from 'discord.js';
import {ENCHANT_LEVEL} from '../../../../constants/enchant';
import sendInteractiveMessage from '../../../../lib/discord.js/message/sendInteractiveMessage';
import {removeUserEnchantTier, setUserEnchantTier} from '../../../../models/user/user.service';

type SelectOptionsValue = ValuesOf<typeof ENCHANT_LEVEL> | 'remove';

export default <PrefixCommand>{
  name: 'setEnchant',
  commands: ['set enchant', 'setEnchant', 'se'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const event = await sendInteractiveMessage({
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
            await removeUserEnchantTier({userId: message.author.id});
            return {
              content: `You have removed your enchant tier`,
              components: [],
            };
          default:
            await setUserEnchantTier({
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
      value: ENCHANT_LEVEL.normie,
    },
    {
      label: 'Good',
      value: ENCHANT_LEVEL.good,
    },
    {
      label: 'Great',
      value: ENCHANT_LEVEL.great,
    },
    {
      label: 'Mega',
      value: ENCHANT_LEVEL.mega,
    },
    {
      label: 'Epic',
      value: ENCHANT_LEVEL.epic,
    },
    {
      label: 'Hyper',
      value: ENCHANT_LEVEL.hyper,
    },
    {
      label: 'Ultimate',
      value: ENCHANT_LEVEL.ultimate,
    },
    {
      label: 'Perfect',
      value: ENCHANT_LEVEL.perfect,
    },
    {
      label: 'Edgy',
      value: ENCHANT_LEVEL.edgy,
    },
    {
      label: 'Ultra Edgy',
      value: ENCHANT_LEVEL['ultra-edgy'],
    },
    {
      label: 'Omega',
      value: ENCHANT_LEVEL.omega,
    },
    {
      label: 'Ultra Omega',
      value: ENCHANT_LEVEL['ultra-omega'],
    },
    {
      label: 'Godly',
      value: ENCHANT_LEVEL.godly,
    },
    {
      label: 'Void',
      value: ENCHANT_LEVEL.void,
    },
    {
      label: 'Remove',
      value: 'remove',
    },
  ]);

const enchantLevel = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
