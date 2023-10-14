import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'ownerBotInfo',
  commands: ['info'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    const embed = await commandHelper.information.ownerInfo({
      client
    });
    djsMessageHelper.send({
      client,
      options: {
        embeds: [embed]
      },
      channelId: message.channelId
    });
  }
};
