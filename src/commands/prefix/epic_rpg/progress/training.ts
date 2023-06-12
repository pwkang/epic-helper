import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {rpgTraining} from '../../../../lib/epic_rpg/commands/progress/training';

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
