import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgWeekly, {isRpgWeeklySuccess} from '../../../../lib/epic_rpg/commands/progress/weekly';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

export default <PrefixCommand>{
  name: 'rpgWeekly',
  commands: ['weekly'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      author: message.author,
      channelId: message.channel.id,
      client,
    });
    if (!event) return;
    event.on('embed', (embed) => {
      if (isRpgWeeklySuccess({embed, user: message.author})) {
        rpgWeekly({
          embed,
          user: message.author,
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
        type: RPG_COMMAND_TYPE.weekly,
      });
    });
  },
};
