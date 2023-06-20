import {rpgForge} from '../../../../lib/epic-rpg/commands/other/forge';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgForge',
  commands: ['forge ultra-edgy sword'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: (client, message) => {
    rpgForge({
      author: message.author,
      client,
      message,
      isSlashCommand: false,
    });
  },
};
