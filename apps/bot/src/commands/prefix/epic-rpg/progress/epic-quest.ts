import {rpgEpicQuest} from '../../../../lib/epic-rpg/commands/progress/epic-quest';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgEpicQuest',
  commands: ['epic quest'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: (client, message) => {
    rpgEpicQuest({
      author: message.author,
      client,
      isSlashCommand: false,
      message,
    });
  },
};
