import {rpgTraining} from '../../../../lib/epic-rpg/commands/progress/training';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgTraining',
  commands: ['training', 'tr'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgTraining({
      author: message.author,
      client,
      isSlashCommand: false,
      message,
    });
  },
};