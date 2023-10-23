import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import ms from 'ms';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import freeDonorService from '../../../../services/database/free-donor.service';

export default <PrefixCommand>{
  name: 'giveFreeDonor',
  commands: ['freeDonor give', 'fd give'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const mentionedUsers = message.mentions.users;
    const mentionedUsersId = args.filter((arg) => arg.match(/^(\d{15,})$/));
    let tokenArg, durationArg;
    for (const arg of args) {
      if (['-token', '-t'].includes(arg)) {
        tokenArg = args[args.indexOf(arg) + 1];
      }
      if (['-duration', '-d'].includes(arg)) {
        durationArg = args[args.indexOf(arg) + 1];
      }
    }
    const token = tokenArg ? parseInt(tokenArg) : null;
    const duration = durationArg ? ms(durationArg) : null;

    if (mentionedUsers.size === 0 && mentionedUsersId.length === 0) {
      djsMessageHelper.send({
        options: {
          content: 'Please mention user',
        },
        channelId: message.channel.id,
        client,
      });
      return;
    }
    if (!token) {
      djsMessageHelper.send({
        options: {
          content: 'Please provide token',
        },
        channelId: message.channel.id,
        client,
      });
      return;
    }
    if (!duration) {
      djsMessageHelper.send({
        options: {
          content: 'Please provide duration',
        },
        channelId: message.channel.id,
        client,
      });
      return;
    }

    await freeDonorService.createFreeDonors({
      token,
      expiresAt: new Date(Date.now() + duration),
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
