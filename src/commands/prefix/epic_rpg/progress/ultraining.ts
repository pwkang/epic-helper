import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgTraining, {isRpgUltrainingSuccess} from '../../../../lib/epic_rpg/commands/training';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

export default <PrefixCommand>{
  name: 'rpgUltraining',
  commands: ['ultr', 'ultraining'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('embed', (embed) => {
      if (isRpgUltrainingSuccess({embed, author: message.author})) {
        rpgTraining({
          author: message.author,
          channelId: message.channel.id,
          client,
          ultraining: true,
        });
        event.stop();
      }
    });
    event.on('cooldown', (cooldown) => {
      updateUserCooldown({
        userId: message.author.id,
        type: RPG_COMMAND_TYPE.training,
        readyAt: new Date(Date.now() + cooldown),
      });
    });
  },
};
