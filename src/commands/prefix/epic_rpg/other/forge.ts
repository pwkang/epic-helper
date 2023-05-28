import {COMMAND_TYPE} from '../../../../constants/bot';
import {rpgForge} from '../../../../lib/epic_rpg/commands/other/forge';

export default <PrefixCommand>{
  name: 'rpgForge',
  commands: ['forge ultra-edgy sword'],
  type: COMMAND_TYPE.rpg,
  execute: (client, message) => {
    rpgForge({
      author: message.author,
      client,
      message,
      isSlashCommand: false,
    });
  },
};
