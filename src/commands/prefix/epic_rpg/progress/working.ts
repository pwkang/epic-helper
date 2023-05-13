import {COMMAND_TYPE} from '../../../../constants/bot';
import {RPG_COMMAND_TYPE, RPG_WORKING_TYPE} from '../../../../constants/rpg';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgWorking, {isRpgWorkingSuccess} from '../../../../lib/epic_rpg/commands/working';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';

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
    });
    event.on('cooldown', (cooldown) => {
      updateUserCooldown({
        userId: message.author.id,
        type: RPG_COMMAND_TYPE.working,
        readyAt: new Date(Date.now() + cooldown),
      });
    });
  },
};
