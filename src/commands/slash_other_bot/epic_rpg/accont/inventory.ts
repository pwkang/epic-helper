import {OTHER_BOT_TYPE} from '../../../../constants/bot';
import {rpgCooldown} from '../../../../lib/epic_rpg/commands/account/cooldown';
import {rpgInventory} from '../../../../lib/epic_rpg/commands/account/inventory';

export default <SlashCommandOtherBot>{
  name: 'rpgInventory',
  bot: OTHER_BOT_TYPE.rpg,
  commandName: ['inventory'],
  execute: async (client, message, author) => {
    rpgInventory({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
