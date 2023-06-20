import {rpgQuest} from '../../../../lib/epic-rpg/commands/progress/quest';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgQuest',
  commands: ['quest'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgQuest({
      author: message.author,
      client,
      message,
      isSlashCommand: false,
    });
  },
};
