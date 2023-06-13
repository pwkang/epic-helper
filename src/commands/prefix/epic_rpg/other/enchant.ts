import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {rpgEnchant} from '../../../../lib/epic_rpg/commands/other/enchant';

export default <PrefixCommand>{
  name: 'rpgEnchant',
  commands: ['enchant', 'refine', 'transmute', 'transcend'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: (client, message) => {
    rpgEnchant({
      client,
      author: message.author,
      message,
      isSlashCommand: false,
    });
  },
};
