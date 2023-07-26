import {EPIC_RPG_ID} from '@epic-helper/constants';
import {serverService} from '../../../../services/database/server.service';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <BotMessage>{
  name: 'random-events-log',
  bot: EPIC_RPG_ID,
  match: (message) => {
    const embed = message.embeds[0];
    if (!embed) return false;
    return embed.fields[0]?.name.includes('EPIC TREE');
  },
  execute: async (client, message) => {
    const serverProfile = await serverService.getServer({
      serverId: message.guild!.id,
    });
    if (!serverProfile) return;
    const randomEvent = serverProfile.settings.randomEvent;
    if (!randomEvent.log) return;
    await djsMessageHelper.send({
      client,
      options: {
        content: randomEvent.log,
      },
      channelId: message.channel.id,
    });
  },
};
