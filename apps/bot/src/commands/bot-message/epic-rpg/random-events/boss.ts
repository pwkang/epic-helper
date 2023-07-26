import {EPIC_RPG_ID} from '@epic-helper/constants';
import {serverService} from '../../../../services/database/server.service';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <BotMessage>{
  name: 'random-events-boss',
  bot: EPIC_RPG_ID,
  match: (message) => {
    const embed = message.embeds[0];
    if (!embed) return false;
    return embed.fields[0]?.name.includes('LEGENDARY BOSS');
  },
  execute: async (client, message) => {
    const serverProfile = await serverService.getServer({
      serverId: message.guild!.id,
    });
    if (!serverProfile) return;
    const randomEvent = serverProfile.settings.randomEvent;
    if (!randomEvent.boss) return;
    await djsMessageHelper.send({
      client,
      options: {
        content: randomEvent.boss,
      },
      channelId: message.channel.id,
    });
  },
};
