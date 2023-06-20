import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {rpgUseEpicItem} from '../../../../lib/epic-rpg/commands/progress/epic-items';

export default <PrefixCommand>{
  name: 'rpgEpicItems',
  commands: ['use ultra bait', 'use coin trumpet', 'use epic seed'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: (client, message) => {
    rpgUseEpicItem({
      author: message.author,
      message,
      client,
      isSlashCommand: false,
    });
  },
};
