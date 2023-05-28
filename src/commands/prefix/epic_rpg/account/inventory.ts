import {COMMAND_TYPE} from '../../../../constants/bot';
import {rpgInventory} from '../../../../lib/epic_rpg/commands/account/inventory';

export default <PrefixCommand>{
  name: 'rpgInventory',
  commands: ['inventory', 'inv', 'i'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message, args) => {
    rpgInventory({
      args,
      author: message.author,
      message,
      client,
      isSlashCommand: false,
    });
  },
};
