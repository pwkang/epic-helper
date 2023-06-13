import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {RPG_WORKING_TYPE} from '../../../../constants/epic-rpg/rpg';
import {rpgWorking} from '../../../../lib/epic-rpg/commands/progress/working';

export default <PrefixCommand>{
  name: 'rpgWorking',
  commands: Object.values(RPG_WORKING_TYPE),
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message, args) => {
    const workingType = Object.values(RPG_WORKING_TYPE).find((type) =>
      args.map((ar) => ar.toLowerCase()).includes(type)
    );
    if (!workingType) return;
    rpgWorking({
      author: message.author,
      message,
      client,
      isSlashCommand: false,
      workingType,
    });
  },
};