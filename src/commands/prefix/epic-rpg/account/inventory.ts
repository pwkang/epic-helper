import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {rpgInventory} from '../../../../lib/epic-rpg/commands/account/inventory';

export default <PrefixCommand>{
  name: 'rpgInventory',
  commands: ['inventory', 'inv', 'i'],
  type: PREFIX_COMMAND_TYPE.rpg,
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
