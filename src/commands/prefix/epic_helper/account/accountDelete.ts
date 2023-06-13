import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {isUserAccountExist, userAccountDelete} from '../../../../models/user/user.service';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';
import {clearUserCooldowns} from '../../../../models/user-reminder/user-reminder.service';
import {clearUserPets} from '../../../../models/user-pet/user-pet.service';
import {djsMessageHelper} from '../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'accountDelete',
  commands: ['delete'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const userExists = await isUserAccountExist(message.author.id);
    if (!userExists) {
      return djsMessageHelper.reply({
        client,
        options: `You have not registered yet!`,
        message,
      });
    }

    const event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: {
        content: `Are you sure you want to delete your account?`,
        components: [row],
      },
    });
    if (!event) return;

    event.on('confirm', async () => {
      await userAccountDelete(message.author.id);
      await clearUserCooldowns(message.author.id);
      await clearUserPets(message.author.id);
      event.stop();
      return {
        content: `Successfully deleted your account!`,
        components: [],
      };
    });
    event.on('cancel', () => {
      event.stop();
      return {
        content: `Successfully canceled!`,
        components: [],
      };
    });
  },
};

const confirm = new ButtonBuilder()
  .setCustomId('confirm')
  .setLabel('Confirm')
  .setStyle(ButtonStyle.Primary);
const cancel = new ButtonBuilder()
  .setCustomId('cancel')
  .setLabel('Cancel')
  .setStyle(ButtonStyle.Secondary);
const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm, cancel);
