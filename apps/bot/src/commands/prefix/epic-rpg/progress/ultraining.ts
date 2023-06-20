import {rpgUltraining} from '../../../../lib/epic-rpg/commands/progress/ultraining';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgUltraining',
  commands: ['ultr', 'ultraining'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgUltraining({
      author: message.author,
      client,
      message,
      isSlashCommand: false,
    });
  },
};
