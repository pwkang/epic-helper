import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {djsMessageHelper} from '../../lib/discordjs/message';
import {ActionRowBuilder, UserSelectMenuBuilder} from 'discord.js';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  execute: async (client, message) => {
    const row = new ActionRowBuilder<UserSelectMenuBuilder>();
    row.addComponents(
      new UserSelectMenuBuilder().setCustomId('test').setPlaceholder('Select a user')
    );
    djsMessageHelper.send({
      channelId: message.channel.id,
      client,
      options: {
        components: [row],
      },
    });
  },
};
