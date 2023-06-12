import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {rpgWeekly} from '../../../../lib/epic_rpg/commands/progress/weekly';

export default <PrefixCommand>{
  name: 'rpgWeekly',
  commands: ['weekly'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgWeekly({
      message,
      author: message.author,
      client,
      isSlashCommand: false,
    });
  },
};
