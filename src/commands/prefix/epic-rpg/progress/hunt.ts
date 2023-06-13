import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {rpgHunt} from '../../../../lib/epic-rpg/commands/progress/hunt';

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
