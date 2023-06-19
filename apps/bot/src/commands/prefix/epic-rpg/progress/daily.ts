import {rpgDaily} from '../../../../lib/epic-rpg/commands/progress/daily';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgDaily',
  commands: ['daily'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgDaily({
      author: message.author,
      message,
      client,
      isSlashCommand: false,
    });
  },
};
