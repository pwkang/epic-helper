import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {toggleHuntSwitch} from '../../../../models/user/user.service';
import replyMessage from '../../../../lib/discord.js/message/replyMessage';

export default <PrefixCommand>{
  name: 'accountHuntSwitch',
  commands: ['hunt switch', 'hs'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const newStatus = await toggleHuntSwitch(message.author.id);

    const content = newStatus
      ? 'Switching hunt reminder message between **HUNT** and **HUNT TOGETHER**\nYou will now hunt with cooldown set in `donor`'
      : 'Stop switching reminder message between **HUNT** and **HUNT TOGETHER**\nYou will now hunt with cooldown set in `donorp`';
    replyMessage({
      client,
      message,
      options: {
        content,
      },
    });
  },
};
