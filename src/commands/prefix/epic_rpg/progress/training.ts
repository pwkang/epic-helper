import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgTraining, {
  isEncounteringPet,
  isRpgTrainingQuestion,
  isRpgTrainingSuccess,
} from '../../../../lib/epic_rpg/commands/progress/training';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';
import getTrainingAnswer from '../../../../utils/epic_rpg/trainingAnswer';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';

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
      if (isRpgTrainingQuestion({author: message.author, content})) {
        event.pendingAnswer();
        const answer = getTrainingAnswer({author: message.author, content});
        sendMessage({
          channelId: message.channel.id,
          client,
          options: {
            components: answer,
          },
        });
      }

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
    event.on('embed', (embed) => {
      if (isEncounteringPet({author: message.author, embed})) {
        event.stop();
      }
    });
  },
};
