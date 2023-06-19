import {rpgHunt} from '../../../../lib/epic-rpg/commands/progress/hunt';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgHunt',
  commands: ['hunt'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgHunt({
      client,
      author: message.author,
      message,
      isSlashCommand: false,
    });
  },
};
