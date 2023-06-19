import {rpgInventory} from '../../../../lib/epic-rpg/commands/account/inventory';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

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
