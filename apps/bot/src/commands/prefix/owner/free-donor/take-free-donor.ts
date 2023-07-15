import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import freeDonorService from '../../../../services/database/free-donor.service';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'takeFreeDonor',
  commands: ['freeDonor take', 'fd take'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const mentionedUsers = message.mentions.users;
    const mentionedUsersId = args.filter((arg) => arg.match(/^(\d{15,})$/));

    await freeDonorService.deleteFreeDonors({
      usersId: [...mentionedUsers.map((user) => user.id), ...mentionedUsersId],
    });
    await djsMessageHelper.send({
      options: {
        content: 'Done',
      },
      channelId: message.channel.id,
      client,
    });
  },
};
