import {rpgEnchant} from '../../../../lib/epic-rpg/commands/other/enchant';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

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
