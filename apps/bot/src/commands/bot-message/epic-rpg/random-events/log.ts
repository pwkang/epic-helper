import {EPIC_RPG_ID} from '@epic-helper/constants';
import {serverService} from '../../../../services/database/server.service';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import toggleServerChecker from '../../../../lib/epic-helper/toggle-checker/server';

export default <BotMessage>{
  name: 'random-events-log',
  bot: EPIC_RPG_ID,
  match: (message) => {
    const embed = message.embeds[0];
    if (!embed) return false;
    return embed.fields[0]?.name.includes('EPIC TREE');
  },
  execute: async (client, message) => {
    if (!message.guild) return;
    const serverProfile = await serverService.getServer({
      serverId: message.guild.id
    });
    if (!serverProfile) return;

    const toggleServer = await toggleServerChecker({
      serverId: message.guild.id
    });
    if (!toggleServer?.randomEvent) return;

    const randomEvent = serverProfile.settings.randomEvent;
    if (!randomEvent.log) return;
    await djsMessageHelper.send({
      client,
      options: {
        content: randomEvent.log
      },
      channelId: message.channel.id
    });
  }
};
