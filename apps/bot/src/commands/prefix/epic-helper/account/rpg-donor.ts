import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  RPG_DONOR_TIER,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';
import {userService} from '../../../../services/database/user.service';

export default <PrefixCommand>{
  name: 'rpgDonor',
  commands: ['donor'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, message) => {
    const nonDonor = new ButtonBuilder()
      .setCustomId('non-donor')
      .setLabel('Non-donor')
      .setStyle(ButtonStyle.Primary);
    const donor1 = new ButtonBuilder()
      .setCustomId('0.9')
      .setLabel('-10%')
      .setStyle(ButtonStyle.Primary);
    const donor2 = new ButtonBuilder()
      .setCustomId('0.8')
      .setLabel('-20%')
      .setStyle(ButtonStyle.Primary);
    const donor3 = new ButtonBuilder()
      .setCustomId('0.65')
      .setLabel('-35%')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      nonDonor,
      donor1,
      donor2,
      donor3
    );

    const event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: {
        content: `Choose your donor tier based on the cooldown reduction`,
        components: [row],
      },
    });
    if (!event) return;

    event.on('non-donor', async () => {
      await userService.updateRpgDonorTier({
        userId: message.author.id,
        tier: RPG_DONOR_TIER.nonDonor,
      });
      event.stop();
      return {
        content: 'You have set your donor tier to Non-Donor',
        components: [],
      };
    });
    event.on('0.9', async () => {
      await userService.updateRpgDonorTier({
        userId: message.author.id,
        tier: RPG_DONOR_TIER.donor10,
      });
      event.stop();
      return {
        content: 'You have set your donor tier to -10%',
        components: [],
      };
    });
    event.on('0.8', async () => {
      await userService.updateRpgDonorTier({
        userId: message.author.id,
        tier: RPG_DONOR_TIER.donor20,
      });
      event.stop();
      return {
        content: 'You have set your donor tier to -20%',
        components: [],
      };
    });
    event.on('0.65', async () => {
      await userService.updateRpgDonorTier({
        userId: message.author.id,
        tier: RPG_DONOR_TIER.donor35,
      });
      event.stop();
      return {
        content: 'You have set your donor tier to -35%',
        components: [],
      };
    });
  },
};
