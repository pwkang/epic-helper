import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {rpgCraft} from '../../../../lib/epic_rpg/commands/other/craft';

export default <PrefixCommand>{
  name: 'rpgCraft',
  commands: ['craft ruby sword', 'craft ruby armor', 'craft coin sword'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: (client, message) => {
    rpgCraft({
      author: message.author,
      message,
      isSlashCommand: false,
      client,
    });
  },
};
