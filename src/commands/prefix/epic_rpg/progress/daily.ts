import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgDaily, {isRpgDailySuccess} from '../../../../lib/epic_rpg/commands/progress/daily';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

export default <PrefixCommand>{
  name: 'rpgDaily',
  commands: ['daily'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      author: message.author,
      channelId: message.channel.id,
      client,
    });
    if (!event) return;
    event.on('embed', (embed) => {
      if (isRpgDailySuccess({embed, user: message.author})) {
        rpgDaily({
          embed,
          author: message.author,
          channelId: message.channel.id,
          client,
        });
        event.stop();
      }
    });
    event.on('cooldown', (cooldown) => {
      updateUserCooldown({
        userId: message.author.id,
        readyAt: new Date(Date.now() + cooldown),
        type: RPG_COMMAND_TYPE.daily,
      });
    });
  },
};
