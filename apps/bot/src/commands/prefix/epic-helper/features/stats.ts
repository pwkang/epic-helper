import type {TEventTypes} from '../../../../lib/epic-helper/features/stats';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export default <PrefixCommand>{
  name: 'stats',
  type: PREFIX_COMMAND_TYPE.bot,
  commands: ['stats', 'stat', 'st'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message) => {
    if (!message.inGuild()) return;
    const stats = await commandHelper.userStats.showStats({
      client,
      author: message.author,
      serverId: message.guild.id,
    });
    if (!stats.hasComponents) {
      return djsMessageHelper.send({
        client,
        channelId: message.channel.id,
        options: stats.render(),
      });
    }

    let event = await djsMessageHelper.interactiveSend<TEventTypes>({
      client,
      channelId: message.channel.id,
      options: stats.render(),
      onStop: () => {
        event = undefined;
      },
    });
    if (!event) return;
    event.every(stats.replyInteraction);
  },
};
