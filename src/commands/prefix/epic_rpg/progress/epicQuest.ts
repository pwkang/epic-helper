import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgEpicQuest, {
  isEpicQuestSuccess,
} from '../../../../lib/epic_rpg/commands/progress/epicQuest';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

export default <PrefixCommand>{
  name: 'rpgEpicQuest',
  commands: ['epic quest'],
  type: COMMAND_TYPE.rpg,
  execute: (client, message) => {
    const event = createRpgCommandListener({
      author: message.author,
      client,
      channelId: message.channel.id,
    });
    if (!event) return;
    event.on('embed', async (embed) => {
      if (isEpicQuestSuccess({embed, author: message.author})) {
        await rpgEpicQuest({
          author: message.author,
          channelId: message.channel.id,
          client,
        });
      }
    });
    event.on('cooldown', async (cooldown) => {
      await updateUserCooldown({
        userId: message.author.id,
        readyAt: new Date(Date.now() + cooldown),
        type: RPG_COMMAND_TYPE.quest,
      });
    });
  },
};
