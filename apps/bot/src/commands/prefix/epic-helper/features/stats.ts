import {
  getStatsEmbeds,
  statsActionRow,
  TEventTypes,
} from '../../../../lib/epic-helper/features/stats';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'stats',
  type: PREFIX_COMMAND_TYPE.bot,
  commands: ['stats', 'stat', 'st'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message) => {
    const embeds = await getStatsEmbeds({
      author: message.author,
    });
    let event = await djsMessageHelper.interactiveSend<TEventTypes>({
      client,
      channelId: message.channel.id,
      options: {embeds: [embeds.donor], components: [statsActionRow]},
      onStop: () => {
        event = undefined;
      },
    });
    if (!event) return;
    event.on('default', async () => {
      return {
        embeds: [embeds.donor],
      };
    });
    event.on('thisWeek', async () => {
      return {
        embeds: [embeds.thisWeek],
      };
    });
    event.on('lastWeek', async () => {
      return {
        embeds: [embeds.lastWeek],
      };
    });
  },
};
