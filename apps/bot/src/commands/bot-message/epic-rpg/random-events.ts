import {EPIC_RPG_ID, RPG_RANDOM_EVENTS} from '@epic-helper/constants';
import {serverService} from '../../../services/database/server.service';
import {djsMessageHelper} from '../../../lib/discordjs/message';
import {typedObjectEntries} from '@epic-helper/utils';

export default <BotMessage>{
  name: 'random-events',
  bot: EPIC_RPG_ID,
  match: (message) => {
    const embed = message.embeds[0];
    if (!embed) return false;
    return (
      ['to help and get a reward', 'join the arena'].some((msg) =>
        embed.fields[0]?.name.includes(msg)
      ) || ['depends on how many players join'].some((msg) => embed.fields[0]?.value.includes(msg))
    );
  },
  execute: async (client, message) => {
    let eventType: ValuesOf<typeof RPG_RANDOM_EVENTS> | undefined;
    for (let [key, value] of typedObjectEntries(keywords)) {
      if (message.embeds[0].fields[0].name.includes(value)) {
        eventType = key;
        break;
      }
    }
    if (!eventType) return;
    const serverProfile = await serverService.getServer({
      serverId: message.guild!.id,
    });
    if (!serverProfile) return;
    const randomEvent = serverProfile.settings.randomEvent;
    if (!randomEvent[eventType]) return;
    await djsMessageHelper.send({
      client,
      options: {
        content: randomEvent[eventType],
      },
      channelId: message.channel.id,
    });
  },
};

const keywords = {
  [RPG_RANDOM_EVENTS.coin]: 'RAINING COINS',
  [RPG_RANDOM_EVENTS.log]: 'EPIC TREE',
  [RPG_RANDOM_EVENTS.fish]: 'MEGALODON',
  [RPG_RANDOM_EVENTS.boss]: 'LEGENDARY BOSS',
  [RPG_RANDOM_EVENTS.lootbox]: 'LOOTBOX SUMMONING',
  [RPG_RANDOM_EVENTS.arena]: 'join the arena',
  [RPG_RANDOM_EVENTS.miniboss]: 'to help and get a reward',
};
