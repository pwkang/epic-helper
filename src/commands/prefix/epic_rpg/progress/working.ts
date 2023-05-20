import {COMMAND_TYPE} from '../../../../constants/bot';
import {RPG_COMMAND_TYPE, RPG_WORKING_TYPE} from '../../../../constants/rpg';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgWorking, {
  isEncounteringRubyDragon,
  isFoughtRubyDragon,
  isRpgWorkingSuccess,
  isRubyMined,
  isWorkingInSpace,
  rubyAmountMined,
} from '../../../../lib/epic_rpg/commands/progress/working';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';
import replyMessage from '../../../../lib/discord.js/message/replyMessage';
import {updateUserRubyAmount} from '../../../../models/user/user.service';

export default <PrefixCommand>{
  name: 'rpgWorking',
  commands: Object.values(RPG_WORKING_TYPE),
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    const workingType = Object.values(RPG_WORKING_TYPE).find((type) =>
      message.content.includes(type)
    );
    event.on('content', async (content) => {
      if (isRpgWorkingSuccess({author: message.author, content})) {
        await rpgWorking({
          client,
          channelId: message.channel.id,
          author: message.author,
          workingType,
        });
        event.stop();
      }
      if (isWorkingInSpace({author: message.author, content})) {
        event.stop();
      }
      if (isRubyMined({author: message.author, content})) {
        const mined = rubyAmountMined({author: message.author, content});
        await updateUserRubyAmount({
          userId: message.author.id,
          type: 'inc',
          ruby: mined,
        });
        event.stop();
      }
      if (isFoughtRubyDragon({author: message.author, content})) {
        await updateUserRubyAmount({
          userId: message.author.id,
          type: 'inc',
          ruby: 10,
        });
        event.stop();
        replyMessage({
          client,
          message,
          options: {
            content: 'You were moved to another area, remember to go back your area!',
          },
        });
      }
    });
    event.on('cooldown', (cooldown) => {
      updateUserCooldown({
        userId: message.author.id,
        type: RPG_COMMAND_TYPE.working,
        readyAt: new Date(Date.now() + cooldown),
      });
    });
    event.on('embed', (embed) => {
      if (isEncounteringRubyDragon({embed, author: message.author})) {
        event.pendingAnswer();
        event.resetTimer(30000);
      }
    });
  },
};
