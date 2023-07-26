import {EPIC_RPG_ID} from '@epic-helper/constants';
import {serverService} from '../../../../services/database/server.service';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <BotMessage>{
  name: 'random-events-miniboss',
  bot: EPIC_RPG_ID,
  match: (message) => {
    const embed = message.embeds[0];
    if (!embed) return false;
    return embed.fields[0]?.name.includes('to help and get a reward');
  },
  execute: async (client, message) => {
    const serverProfile = await serverService.getServer({
      serverId: message.guild!.id,
    });
    if (!serverProfile) return;
    const randomEvent = serverProfile.settings.randomEvent;
    if (!randomEvent.miniboss) return;
    await djsMessageHelper.send({
      client,
      options: {
        content: randomEvent.miniboss,
      },
      channelId: message.channel.id,
    });
  },
};