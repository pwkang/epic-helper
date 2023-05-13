import {COMMAND_TYPE} from '../../../../constants/bot';
import {LOOTBOX_ABBREVIATION} from '../../../../constants/lootbox';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgBuyLootbox, {
  isLootboxSuccessfullyBought,
} from '../../../../lib/epic_rpg/commands/progress/lootbox';
import {updateUserCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

export default <PrefixCommand>{
  name: 'rpgBuyLootbox',
  type: COMMAND_TYPE.rpg,
  commands: Object.values(LOOTBOX_ABBREVIATION)
    .flat()
    .map((type) => ['lootbox', 'lb'].map((lb) => `buy ${type} ${lb}`))
    .flatMap((x) => x),
  execute: async (client, message) => {
    const event = createRpgCommandListener({
      author: message.author,
      channelId: message.channel.id,
      client,
    });
    if (!event) return;
    event.on('content', (content) => {
      if (isLootboxSuccessfullyBought({content})) {
        rpgBuyLootbox({
          user: message.author,
          client,
          channelId: message.channel.id,
          content,
        });
        event.stop();
      }
    });
    event.on('cooldown', (cooldown) => {
      updateUserCooldown({
        type: RPG_COMMAND_TYPE.lootbox,
        readyAt: new Date(Date.now() + cooldown),
        userId: message.author.id,
      });
    });
  },
};
