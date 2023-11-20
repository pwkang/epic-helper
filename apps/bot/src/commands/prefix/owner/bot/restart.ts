import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'restartBot',
  preCheck: {},
  commands: ['restart'],
  type: PREFIX_COMMAND_TYPE.dev,
  execute: async (client, message, args) => {
    const ids = args.slice(1).filter((id) => !isNaN(Number(id))).map(Number);
    let content = '';

    if (ids.length) {
      await commandHelper.cluster.restartClusters(client, ids);
      content = `Restarting clusters ${ids.join(', ')}...`;
    } else if(args[1] === 'all') {
      await commandHelper.cluster.restartAll(client);
      content = 'Restarting all clusters...';
    }else{
      content = 'Please provide cluster id(s) or `all`';
    }


    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: {
        content,
      },
    });
  },
};
