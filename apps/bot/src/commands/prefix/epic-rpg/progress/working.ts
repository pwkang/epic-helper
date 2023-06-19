import {rpgWorking} from '../../../../lib/epic-rpg/commands/progress/working';
import {PREFIX_COMMAND_TYPE, RPG_WORKING_TYPE} from '@epic-helper/constants';

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
