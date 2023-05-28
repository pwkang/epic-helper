import {COMMAND_TYPE} from '../../../../constants/bot';
import {rpgEnchant} from '../../../../lib/epic_rpg/commands/other/enchant.lib';

export default <PrefixCommand>{
  name: 'rpgEnchant',
  commands: ['enchant', 'refine', 'transmute', 'transcend'],
  type: COMMAND_TYPE.rpg,
  execute: (client, message) => {
    rpgEnchant({
      client,
      author: message.author,
      message,
      isSlashCommand: false,
    });
  },
};
