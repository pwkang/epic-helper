import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {rpgEpicQuest} from '../../../../lib/epic_rpg/commands/progress/epicQuest';

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
