import {COMMAND_TYPE} from '../../../../constants/bot';
import {LOOTBOX_ABBREVIATION} from '../../../../constants/epic_rpg/lootbox';
import {rpgBuyLootbox} from '../../../../lib/epic_rpg/commands/progress/lootbox';

export default <PrefixCommand>{
  name: 'rpgBuyLootbox',
  type: COMMAND_TYPE.rpg,
  commands: Object.values(LOOTBOX_ABBREVIATION)
    .flat()
    .map((type) => ['lootbox', 'lb'].map((lb) => `buy ${type} ${lb}`))
    .flatMap((x) => x),
  execute: async (client, message) => {
    rpgBuyLootbox({
      author: message.author,
      client,
      message,
      isSlashCommand: false,
    });
  },
};
