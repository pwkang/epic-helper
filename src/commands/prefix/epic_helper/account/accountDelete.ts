import {COMMAND_TYPE} from '../../../../constants/bot';
import {userAccountDelete, isUserAccountExist} from '../../../../models/user/user.service';
import sendInteractiveMessage from '../../../../lib/discord.js/message/sendInteractiveMessage';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';
import replyMessage from '../../../../lib/discord.js/message/replyMessage';

export default <PrefixCommand>{
  name: 'accountDelete',
  commands: ['delete'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const userExists = await isUserAccountExist(message.author.id);
    if (!userExists) {
      return replyMessage({
        client,
        options: `You have not registered yet!`,
        message,
      });
    }

    const confirm = new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('Confirm')
      .setStyle(ButtonStyle.Primary);
    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm, cancel);

    const event = await sendInteractiveMessage({
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
