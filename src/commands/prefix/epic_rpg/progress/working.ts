import {COMMAND_TYPE} from '../../../../constants/bot';
import {RPG_WORKING_TYPE} from '../../../../constants/rpg';
import {rpgWorking} from '../../../../lib/epic_rpg/commands/progress/working';

export default <PrefixCommand>{
  name: 'rpgWorking',
  commands: Object.values(RPG_WORKING_TYPE),
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgWorking({
      author: message.author,
      message,
      client,
      isSlashCommand: false,
    });
  },
};
