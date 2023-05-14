import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgHunt, {
  isPartnerUnderCommand,
  isRpgHuntSuccess,
  isUserEncounterZombieHorde,
  isUserJoinedTheHorde,
  isZombieHordeEnded,
} from '../../../../lib/epic_rpg/commands/progress/hunt';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';
import replyMessage from '../../../../lib/discord.js/message/replyMessage';

export default <PrefixCommand>{
  name: 'rpgHunt',
  commands: ['hunt'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      client,
      channelId: message.channel.id,
      author: message.author,
    });
    if (!event) return;
    event.on('content', (content) => {
      if (
        isRpgHuntSuccess({author: message.author, content}) ||
        isZombieHordeEnded({author: message.author, content})
      ) {
        rpgHunt({
          client,
          channelId: message.channel.id,
          author: message.author,
          content,
        });
        event.stop();
      }

      if (isUserJoinedTheHorde({author: message.author, content})) {
        replyMessage({
          message,
          client,
          options: {
            content: `You were moved to area 2, remember to go back your area!`,
          },
        });
      }

      if (isPartnerUnderCommand({author: message.author, message})) event.stop();
    });
    event.on('embed', (embed) => {
      if (isUserEncounterZombieHorde({author: message.author, embed})) {
        event.resetTimer(20000);
        event.pendingAnswer();
      }
    });
    event.on('cooldown', (cooldown) => {
      updateUserCooldown({
        userId: message.author.id,
        type: RPG_COMMAND_TYPE.hunt,
        readyAt: new Date(Date.now() + cooldown),
      });
      event.stop();
    });
  },
};
