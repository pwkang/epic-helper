import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgQuest, {
  isQuestAccepted,
  isQuestDeclined,
} from '../../../../lib/epic_rpg/commands/progress/quest';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

export default <PrefixCommand>{
  name: 'rpgQuest',
  commands: ['quest'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('content', (content, collected) => {
      if (isQuestAccepted({author: message.author, content})) {
        rpgQuest({
          author: message.author,
          channelId: message.channel.id,
          client,
        });
        event.stop();
      }
      if (isQuestDeclined({message: collected, author: message.author})) {
        rpgQuest({
          author: message.author,
          channelId: message.channel.id,
          client,
        });
      }
    });
    event.on('cooldown', (cooldown) => {
      updateUserCooldown({
        userId: message.author.id,
        type: RPG_COMMAND_TYPE.quest,
        readyAt: new Date(Date.now() + cooldown),
      });
    });
  },
};
