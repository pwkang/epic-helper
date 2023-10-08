import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'freeDonor',
  commands: ['freeDonor', 'fd'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    const donor = commandHelper.freeDonor.listFreeDonors({
      client,
    });
    let event = await djsMessageHelper.interactiveSend({
      options: await donor.render(),
      client,
      channelId: message.channel.id,
      onStop: () => {
        event = undefined;
      },
    });
    if (!event) return;
    event.every(async (interaction) => {
      if (!interaction.isRepliable()) return null;
      return await donor.responseInteraction(interaction);
    });
  },
};
