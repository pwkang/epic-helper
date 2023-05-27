import {COMMAND_TYPE} from '../../../../constants/bot';
import {rpgDaily} from '../../../../lib/epic_rpg/commands/progress/daily';

export default <PrefixCommand>{
  name: 'rpgDaily',
  commands: ['daily'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgDaily({
      author: message.author,
      message,
      client,
      isSlashCommand: false,
    });
  },
};
