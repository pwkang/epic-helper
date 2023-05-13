import {COMMAND_TYPE} from '../../../constants/bot';
import {createRpgCommandListener} from '../../../lib/epic_rpg/createRpgCommandListener';
import {updateUserCooldown} from '../../../models/user-reminder/user-reminder.service';
import rpgFarm, {isRpgFarmSuccess} from '../../../lib/epic_rpg/commands/farm';
import {RPG_COMMAND_TYPE} from '../../../constants/rpg';

export default <PrefixCommand>{
  name: 'rpgFarm',
  commands: ['farm'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      author: message.author,
      client,
      channelId: message.channel.id,
    });
    if (!event) return;
    event.on('content', (content) => {
      if (isRpgFarmSuccess({content, author: message.author})) {
        rpgFarm({
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
        readyAt: new Date(Date.now() + cooldown),
        type: RPG_COMMAND_TYPE.farm,
      });
    });
  },
};
