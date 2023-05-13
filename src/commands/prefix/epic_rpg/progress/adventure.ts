import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgAdventure, {isRpgAdventureSuccess} from '../../../../lib/epic_rpg/commands/adventure';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

export default <PrefixCommand>{
  name: 'rpgAdventure',
  commands: ['adventure', 'adv'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      author: message.author,
      client,
    });
    if (!event) return;
    event.on('content', (content) => {
      if (isRpgAdventureSuccess({author: message.author, content})) {
        rpgAdventure({
          author: message.author,
          client,
          channelId: message.channel.id,
          content,
        });
        event.stop();
      }
    });
    event.on('cooldown', (cooldown) => {
      updateUserCooldown({
        userId: message.author.id,
        type: RPG_COMMAND_TYPE.adventure,
        readyAt: new Date(Date.now() + cooldown),
      });
    });
  },
};
