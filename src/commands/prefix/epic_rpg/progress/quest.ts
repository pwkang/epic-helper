import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {rpgQuest} from '../../../../lib/epic_rpg/commands/progress/quest';

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
