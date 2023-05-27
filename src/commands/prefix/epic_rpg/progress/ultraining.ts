import {COMMAND_TYPE} from '../../../../constants/bot';
import {rpgUltraining} from '../../../../lib/epic_rpg/commands/progress/ultraining';

export default <PrefixCommand>{
  name: 'rpgUltraining',
  commands: ['ultr', 'ultraining'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgUltraining({
      author: message.author,
      client,
      message,
    });
  },
};
