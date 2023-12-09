import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {freeDonorService} from '@epic-helper/services';

export default <PrefixCommand>{
  name: 'takeFreeDonor',
  commands: ['freeDonor take', 'fd take'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const mentionedUsers = message.mentions.users;
    const mentionedUsersId = args.filter((arg) => arg.match(/^(\d{15,})$/));
    const usersId = [
      ...mentionedUsers.map((user) => user.id),
      ...mentionedUsersId,
    ];
    await freeDonorService.deleteFreeDonors({
      usersId,
    });
    await djsMessageHelper.send({
      options: {
        content: 'Done',
      },
      channelId: message.channel.id,
      client,
    });

    /*for (const userId of usersId) {
      await commandHelper.epicToken.syncBoostedServers({
        userId,
      });
    }*/
  },
};
