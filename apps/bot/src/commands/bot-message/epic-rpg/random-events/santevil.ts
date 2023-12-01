import {EPIC_RPG_ID} from '@epic-helper/constants';
import {serverService} from '../../../../services/database/server.service';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import toggleServerChecker from '../../../../lib/epic-helper/toggle-checker/server';

export default <BotMessage>{
  name: 'random-events-miniboss',
  bot: EPIC_RPG_ID,
  match: (message) => {
    const embed = message.embeds[0];
    if (!embed) return false;
    return embed.fields[0]?.name.includes('SANTEVIL');
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
    if (!randomEvent.santevil) return;
    await djsMessageHelper.send({
      client,
      options: {
        content: randomEvent.santevil,
      },
      channelId: message.channel.id,
    });
  },
};