import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgTraining, {
  isRpgTrainingSuccess,
} from '../../../../lib/epic_rpg/commands/progress/training';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

export default <PrefixCommand>{
  name: 'rpgTraining',
  commands: ['training', 'tr'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('content', (content) => {
      if (isRpgTrainingSuccess({author: message.author, content})) {
        rpgTraining({
          author: message.author,
          channelId: message.channel.id,
          client,
          ultraining: false,
        });
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
