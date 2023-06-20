import {rpgWeekly} from '../../../../lib/epic-rpg/commands/progress/weekly';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

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
