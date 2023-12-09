import {EPIC_RPG_ID} from '@epic-helper/constants';
import {serverService} from '@epic-helper/services';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import toggleServerChecker from '../../../../lib/epic-helper/toggle-checker/server';

export default <BotMessage>{
  name: 'random-events-coin',
  bot: EPIC_RPG_ID,
  match: (message) => {
    const embed = message.embeds[0];
    if (!embed) return false;
    return embed.fields[0]?.name.includes('RAINING COINS');
  },
  execute: async (client, message) => {
    if (!message.guild) return;
    const serverProfile = await serverService.getServer({
      serverId: message.guild.id,
    });
    if (!serverProfile) return;

    const toggleServer = await toggleServerChecker({
      serverId: message.guild.id,
    });
    if (!toggleServer?.randomEvent) return;

    const randomEvent = serverProfile.settings.randomEvent;
    if (!randomEvent.coin) return;
    await djsMessageHelper.send({
      client,
      options: {
        content: randomEvent.coin,
      },
      channelId: message.channel.id,
    });
  },
};
